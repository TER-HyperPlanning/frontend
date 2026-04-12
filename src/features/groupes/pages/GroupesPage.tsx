import { ArrowLeft, Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/layout/PageLayout'
import AssignModal from '@/features/groupes/components/AssignModal'
import DeleteGroupTransferModal from '@/features/groupes/components/DeleteGroupTransferModal'
import EmptyGroupState from '@/features/groupes/components/EmptyGroupState'
import GroupFormModal, {
  type GroupFormValues,
  type FormationOption,
} from '@/features/groupes/components/GroupFormModal'
import GroupFilters from '@/features/groupes/components/GroupFilters'
import GroupTable from '@/features/groupes/components/GroupTable'
import type { Group, SortKey, Student } from '@/features/groupes/types'
import { deleteAttend, deleteAttendsByGroup, getAttendsByGroup } from '@/services/attendService'
import { createGroup, deleteGroup, getGroups, getGroupsByFormation, updateGroup } from '@/services/groupService'
import { getStudents, updateStudent } from '@/services/studentService'
import { getProgramById, getPrograms } from '@/services/programService'
import { getTracks } from '@/services/trackService'
import type { GroupModel, ProgramModel, StudentModel, TrackResponse } from '@/types/formation'

const GROUP_CAPACITY_LIMIT = 30

interface GroupesPageProps {
  formationId?: string
  selectedGroupId?: string
  forceShowBackActions?: boolean
  onSelectGroup?: (groupId: string) => void
  onShowAllGroups?: () => void
  onBackToFormation?: () => void
}

export function GroupesPage({
  formationId,
  selectedGroupId,
  forceShowBackActions,
  onSelectGroup,
  onShowAllGroups,
  onBackToFormation,
}: GroupesPageProps) {
  const [groupes, setGroupes] = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [academicYearFilter, setAcademicYearFilter] = useState('all')
  const [trackFilter, setTrackFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [assignGroupe, setAssignGroupe] = useState<Group | null>(null)
  const [groupFormMode, setGroupFormMode] = useState<'create' | 'edit' | null>(null)
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
  const [deleteAffectedCount, setDeleteAffectedCount] = useState(0)
  const [isDeletingGroup, setIsDeletingGroup] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [formationOptions, setFormationOptions] = useState<FormationOption[]>([])

  const loadData = async (currentFormationId?: string) => {
    const [groupModels, trackModels, programModelsOrProgram, studentModels]: [
      GroupModel[],
      TrackResponse[],
      ProgramModel[] | ProgramModel,
      StudentModel[],
    ] = await Promise.all([
      currentFormationId ? getGroupsByFormation(currentFormationId) : getGroups(),
      getTracks(),
      currentFormationId ? getProgramById(currentFormationId) : getPrograms(),
      getStudents().catch(() => [] as StudentModel[]),
    ])

    const programList = Array.isArray(programModelsOrProgram) ? programModelsOrProgram : [programModelsOrProgram]
    const programById = new Map<string, ProgramModel>(
      programList.map((program: ProgramModel) => [program.id, program]),
    )

    const relevantTrackModels = currentFormationId
      ? trackModels.filter(track => track.programId === currentFormationId)
      : trackModels

    const trackById = new Map<string, TrackResponse>(
      relevantTrackModels.map((track: TrackResponse) => [track.id, track]),
    )

    const formations = programList
      .map(program => {
        const firstTrack = relevantTrackModels.find(track => track.programId === program.id)

        if (!firstTrack) {
          return null
        }

        return {
          id: program.id,
          name: program.name,
          trackId: firstTrack.id,
        }
      })
      .filter((formation): formation is FormationOption => formation !== null)

    setFormationOptions(currentFormationId ? formations.filter(formation => formation.id === currentFormationId) : formations)

    const normalizedGroups = normalizeGroups(groupModels, trackById, programById, studentModels)
    const visibleGroups = currentFormationId
      ? normalizedGroups.filter(group => group.programId === currentFormationId)
      : normalizedGroups

    setGroupes(visibleGroups)
    setStudents(normalizeStudents(studentModels))
  }

  const groupesWithLiveEffectif = useMemo(() => {
    const countByGroupId = students.reduce<Record<string, number>>((acc, student) => {
      if (student.groupId) {
        acc[student.groupId] = (acc[student.groupId] ?? 0) + 1
      }
      return acc
    }, {})

    return groupes.map(groupe => ({
      ...groupe,
      studentCount: countByGroupId[groupe.id] ?? 0,
    }))
  }, [groupes, students])

  const selectedGroup = useMemo(
    () => groupesWithLiveEffectif.find(groupe => groupe.id === selectedGroupId) ?? null,
    [groupesWithLiveEffectif, selectedGroupId],
  )
  const showFormationActions = Boolean(formationId || selectedGroup || forceShowBackActions)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setErrorMsg(null)

      try {
        await loadData(formationId)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors du chargement des groupes'
        setErrorMsg(message)
        console.error('Erreur lors du chargement des groupes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [formationId])

  const academicYears = useMemo(
    () => [...new Set(groupesWithLiveEffectif.map(groupe => groupe.academicYear))].sort(),
    [groupesWithLiveEffectif],
  )

  const tracks = useMemo(
    () => [...new Set(groupesWithLiveEffectif.map(groupe => groupe.trackName))].sort(),
    [groupesWithLiveEffectif],
  )

  const deleteTargetCandidates = useMemo(
    () => (groupToDelete ? groupesWithLiveEffectif.filter(groupe => groupe.id !== groupToDelete.id) : []),
    [groupToDelete, groupesWithLiveEffectif],
  )

  const filteredAndSortedGroupes = useMemo(() => {
    if (selectedGroupId) {
      return selectedGroup ? [selectedGroup] : []
    }

    const filtered = groupesWithLiveEffectif.filter(groupe => {
      const matchesAcademicYear = academicYearFilter === 'all' || groupe.academicYear === academicYearFilter
      const matchesTrack = trackFilter === 'all' || groupe.trackName === trackFilter
      const matchesSearch =
        groupe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.trackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.programName.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesAcademicYear && matchesTrack && matchesSearch
    })

    if (!sortConfig.key) {
      return filtered
    }

    return [...filtered].sort((first, second) => {
      const firstValue = first[sortConfig.key!]
      const secondValue = second[sortConfig.key!]

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return sortConfig.direction === 'asc' ? firstValue - secondValue : secondValue - firstValue
      }

      return sortConfig.direction === 'asc'
        ? String(firstValue ?? '').localeCompare(String(secondValue ?? ''), 'fr', { sensitivity: 'base' })
        : String(secondValue ?? '').localeCompare(String(firstValue ?? ''), 'fr', { sensitivity: 'base' })
    })
  }, [groupesWithLiveEffectif, academicYearFilter, trackFilter, searchTerm, sortConfig, selectedGroup, selectedGroupId])

  const handleSort = (key: SortKey) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  const handleAssignConfirm = async (
    groupeId: string,
    studentIds: string[],
    transferGroupIdForRemoved: string | null,
  ) => {
    setErrorMsg(null)

    const selectedIds = new Set(studentIds)
    const currentGroupStudents = students.filter(student => student.groupId === groupeId)
    const assignments = students.filter(student => selectedIds.has(student.id) && student.groupId !== groupeId)
    const unassignments = currentGroupStudents.filter(student => !selectedIds.has(student.id))
    const sourceCurrentCount = currentGroupStudents.length
    const sourceFinalCount = studentIds.length
    const isReducingOverCapacity = sourceCurrentCount > GROUP_CAPACITY_LIMIT && sourceFinalCount < sourceCurrentCount
    const effectiveTransferGroupId = transferGroupIdForRemoved

    if (sourceFinalCount > GROUP_CAPACITY_LIMIT && !isReducingOverCapacity) {
      const message = `Capacite depassee: ${sourceFinalCount}/${GROUP_CAPACITY_LIMIT} pour ce groupe.`
      setErrorMsg(message)
      throw new Error(message)
    }

    if (effectiveTransferGroupId) {
      const targetGroupCurrentCount = students.filter(student => student.groupId === effectiveTransferGroupId).length
      const targetAfterTransfer = targetGroupCurrentCount + unassignments.length

      if (targetAfterTransfer > GROUP_CAPACITY_LIMIT) {
        const message = `Le groupe de destination depasserait la capacite (${targetAfterTransfer}/${GROUP_CAPACITY_LIMIT}).`
        setErrorMsg(message)
        throw new Error(message)
      }
    }

    try {
      await Promise.all([
        ...assignments.map(student =>
          updateStudent(student.id, {
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            phone: student.phone,
            groupId: groupeId,
          }),
        ),
        ...unassignments.map(student =>
          updateStudent(student.id, {
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            phone: student.phone,
            groupId: effectiveTransferGroupId,
          }),
        ),
      ])

      const currentGroupStudentIds = new Set(currentGroupStudents.map(student => student.id))
      setStudents(prev =>
        prev.map(student => {
          if (selectedIds.has(student.id)) {
            return { ...student, groupId: groupeId }
          }

          if (currentGroupStudentIds.has(student.id) && !selectedIds.has(student.id)) {
            return { ...student, groupId: effectiveTransferGroupId }
          }

          return student
        }),
      )
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Operation impossible.'
      if (/Missing required fields:\s*groupId/i.test(rawMessage)) {
        const message = "Le backend n'autorise pas encore le mode \"sans groupe\". Il faut choisir un groupe de destination."
        setErrorMsg(message)
        throw new Error(message)
      }
      setErrorMsg(rawMessage)
      throw error
    }

    await loadData(formationId)

    const groupe = groupes.find(item => item.id === groupeId)
    setSuccessMsg(
      `${assignments.length} etudiant${assignments.length > 1 ? 's' : ''} assigne${assignments.length > 1 ? 's' : ''} a ${groupe?.name}`,
    )
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const reloadData = async () => {
    await loadData(formationId)
  }

  const handleCreateGroup = async (values: GroupFormValues) => {
    await createGroup(values)
    await reloadData()
    setSuccessMsg(`Le groupe ${values.name} a été créé.`)
  }

  const handleEditGroup = async (values: GroupFormValues) => {
    if (!groupToEdit) return
    await updateGroup(groupToEdit.id, values)
    await reloadData()
    setSuccessMsg(`Le groupe ${values.name} a été modifié.`)
  }

  const deleteGroupWithTransfer = async (group: Group, targetGroupId: string | null) => {
    setErrorMsg(null)
    setIsDeletingGroup(true)

    try {
      const freshStudents = normalizeStudents(await getStudents().catch(() => [] as StudentModel[]))
      const affectedStudents = freshStudents.filter(student => student.groupId === group.id)

      if (affectedStudents.length > 0 && !targetGroupId) {
        throw new Error('Selectionne un groupe de destination pour transferer les etudiants avant suppression.')
      }

      if (targetGroupId) {
        const failures: Array<{ id: string; reason: string }> = []

        for (const student of affectedStudents) {
          try {
            await updateStudent(student.id, { groupId: targetGroupId })
          } catch {
            try {
              await updateStudent(student.id, {
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                phone: student.phone,
                groupId: targetGroupId,
              })
            } catch (error) {
              const reason = error instanceof Error ? error.message : 'Erreur inconnue'
              failures.push({ id: student.id, reason })
            }
          }
        }

        if (failures.length > 0) {
          throw new Error(`Transfert impossible pour ${failures.length} etudiant(s). Exemple: ${failures[0]?.reason ?? 'Erreur inconnue'}`)
        }
      }

      try {
        await deleteAttendsByGroup(group.id)
      } catch {
        try {
          const attends = await getAttendsByGroup(group.id)
          for (const attend of attends) {
            if (!attend.groupId || !attend.sessionId) continue
            await deleteAttend(attend.groupId, attend.sessionId)
          }
        } catch {
          // On laisse la suppression du groupe confirmer s'il reste des references.
        }
      }

      try {
        const remains = await getAttendsByGroup(group.id)
        if (remains.length > 0) {
          throw new Error(
            `Suppression bloquee: ${remains.length} liaison(s) de presence (Attend) reference(nt) encore ce groupe.`,
          )
        }
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('Suppression bloquee:')) {
          throw error
        }
      }

      try {
        await deleteGroup(group.id)
      } catch (deleteError) {
        const refreshedGroups = await getGroups()
        const stillExists = refreshedGroups.some(item => item.id === group.id)

        if (stillExists) {
          const reason = deleteError instanceof Error ? deleteError.message : 'Erreur inconnue'
          throw new Error(`Suppression API refusee pour le groupe ${group.name}. Detail: ${reason}`)
        }
      }

      await reloadData()
      setGroupToDelete(null)
      setSuccessMsg(
        targetGroupId
          ? `Le groupe ${group.name} a ete supprime apres transfert des etudiants.`
          : `Le groupe ${group.name} a ete supprime.`,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Suppression du groupe impossible.'
      setErrorMsg(message)
      console.error('Erreur lors de la suppression du groupe:', error)
    } finally {
      setIsDeletingGroup(false)
    }
  }

  const handleDeleteGroup = async (group: Group) => {
    setErrorMsg(null)

    try {
      const freshStudents = normalizeStudents(await getStudents().catch(() => [] as StudentModel[]))
      setStudents(freshStudents)
      const affectedStudents = freshStudents.filter(student => student.groupId === group.id)
      setDeleteAffectedCount(affectedStudents.length)

      const hasAnyTargetGroup = groupesWithLiveEffectif.some(item => item.id !== group.id)
      if (affectedStudents.length > 0 && !hasAnyTargetGroup) {
        throw new Error(
          "Suppression impossible: ce groupe contient des etudiants et aucun groupe de destination n'existe. Cree d'abord un autre groupe.",
        )
      }

      setGroupToDelete(group)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de preparer la suppression du groupe.'
      setErrorMsg(message)
    }
  }

  return (
    <PageLayout className="p-6 overflow-y-auto">
      {errorMsg && (
        <div className="alert alert-error mb-4">
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg">
            <Check size={16} />
            <span className="text-sm">{successMsg}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Gestion des Groupes</h1>
          <p className="text-sm text-base-content/60 mt-1">Gérez et organisez les groupes d'étudiants</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setGroupToEdit(null)
              setGroupFormMode('create')
            }}
          >
            Nouveau groupe
          </button>
        </div>
      </div>

      {showFormationActions && (
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-2"
            onClick={() => {
              if (onBackToFormation) {
                onBackToFormation()
              }
            }}
            aria-label="Retour à la formation"
            title="Retour à la formation"
            disabled={!onBackToFormation}
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {selectedGroup && <div className="badge badge-info badge-lg">{selectedGroup.name}</div>}
          </div>
        </div>
      )}

      <GroupFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        academicYearFilter={academicYearFilter}
        onAcademicYearChange={setAcademicYearFilter}
        trackFilter={trackFilter}
        onTrackChange={setTrackFilter}
        academicYears={academicYears}
        tracks={tracks}
      />

      <div className="card bg-base-100 border border-base-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16 gap-3">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <span className="text-base-content/60 text-sm">Chargement des groupes...</span>
            </div>
          ) : filteredAndSortedGroupes.length === 0 ? (
            <EmptyGroupState />
          ) : (
            <GroupTable
              groupes={filteredAndSortedGroupes}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={onSelectGroup ? group => onSelectGroup(group.id) : undefined}
              onAssign={setAssignGroupe}
              onEdit={group => {
                setGroupToEdit(group)
                setGroupFormMode('edit')
              }}
              onDelete={handleDeleteGroup}
            />
          )}
        </div>
      </div>

      {assignGroupe && (
        <AssignModal
          groupe={assignGroupe}
          students={students}
          availableGroups={groupesWithLiveEffectif.filter(group => group.id !== assignGroupe.id)}
          maxStudents={GROUP_CAPACITY_LIMIT}
          onClose={() => setAssignGroupe(null)}
          onConfirm={handleAssignConfirm}
        />
      )}

      {groupFormMode && (
        <GroupFormModal
          isOpen={Boolean(groupFormMode)}
          mode={groupFormMode}
          group={groupToEdit}
          formations={formationOptions}
          onClose={() => {
            setGroupFormMode(null)
            setGroupToEdit(null)
          }}
          onSubmit={groupFormMode === 'create' ? handleCreateGroup : handleEditGroup}
        />
      )}

      {groupToDelete && (
        <DeleteGroupTransferModal
          isOpen={Boolean(groupToDelete)}
          group={groupToDelete}
          candidateGroups={deleteTargetCandidates}
          affectedStudentsCount={deleteAffectedCount}
          isSubmitting={isDeletingGroup}
          errorMessage={errorMsg}
          onClose={() => {
            if (isDeletingGroup) return
            setGroupToDelete(null)
            setDeleteAffectedCount(0)
          }}
          onConfirm={targetGroupId => deleteGroupWithTransfer(groupToDelete, targetGroupId)}
        />
      )}
    </PageLayout>
  )
}

function normalizeStudents(studentModels: StudentModel[]): Student[] {
  return studentModels.map(student => ({
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    groupId: student.groupId,
  }))
}

function normalizeGroups(
  groupModels: GroupModel[],
  trackById: Map<string, TrackResponse>,
  programById: Map<string, ProgramModel>,
  studentModels: StudentModel[],
): Group[] {
  const studentCountByGroupId = studentModels.reduce<Record<string, number>>((acc, student) => {
    if (student.groupId) {
      acc[student.groupId] = (acc[student.groupId] ?? 0) + 1
    }
    return acc
  }, {})

  return groupModels.map(group => {
    const track = group.trackId ? trackById.get(group.trackId) : undefined
    const program = track?.programId ? programById.get(track.programId) : undefined

    return {
      id: group.id,
      name: group.name,
      academicYear: group.academicYear,
      trackId: group.trackId,
      programId: track?.programId ?? null,
      trackName: track?.name ?? 'Parcours inconnu',
      programName: program?.name ?? 'Formation inconnue',
      studentCount: studentCountByGroupId[group.id] ?? 0,
    }
  })
}
