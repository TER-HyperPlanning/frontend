import { createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/layout/PageLayout'
import AssignModal from '@/features/groupes/components/AssignModal'
import EmptyGroupState from '@/features/groupes/components/EmptyGroupState'
import GroupFormModal, {
  type GroupFormValues,
  type TrackOption,
} from '@/features/groupes/components/GroupFormModal'
import GroupFilters from '@/features/groupes/components/GroupFilters'
import GroupTable from '@/features/groupes/components/GroupTable'
import type { Group, SortKey, Student } from '@/features/groupes/types'
import { createGroup, deleteGroup, getGroups, updateGroup } from '@/services/groupService'
import { getStudents, updateStudent } from '@/services/studentService'
import { getPrograms } from '@/services/programService'
import { getTracks } from '@/services/trackService'
import type { GroupModel, ProgramModel, StudentModel, TrackResponse } from '@/types/formation'

export const Route = createFileRoute('/(app)/groupes/')({
  component: RouteComponent,
})

function RouteComponent() {
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [trackOptions, setTrackOptions] = useState<TrackOption[]>([])

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setErrorMsg(null)

      try {
        const [groupModels, studentModels, trackModels, programModels]: [
          GroupModel[],
          StudentModel[],
          TrackResponse[],
          ProgramModel[],
        ] = await Promise.all([
          getGroups(),
          getStudents(),
          getTracks(),
          getPrograms(),
        ])

        const trackById = new Map<string, TrackResponse>(
          trackModels.map((track: TrackResponse) => [track.id, track]),
        )
        const programById = new Map<string, ProgramModel>(
          programModels.map((program: ProgramModel) => [program.id, program]),
        )

        setTrackOptions(
          trackModels.map(track => ({
            id: track.id,
            name: track.name,
            programName: programById.get(track.programId)?.name ?? 'Formation inconnue',
          })),
        )
        setGroupes(normalizeGroups(groupModels, trackById, programById, studentModels))
        setStudents(normalizeStudents(studentModels))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors du chargement des groupes'
        setErrorMsg(message)
        console.error('Erreur lors du chargement des groupes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const academicYears = useMemo(
    () => [...new Set(groupesWithLiveEffectif.map(groupe => groupe.academicYear))].sort(),
    [groupesWithLiveEffectif],
  )

  const tracks = useMemo(
    () => [...new Set(groupesWithLiveEffectif.map(groupe => groupe.trackName))].sort(),
    [groupesWithLiveEffectif],
  )

  const filteredAndSortedGroupes = useMemo(() => {
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
  }, [groupesWithLiveEffectif, academicYearFilter, trackFilter, searchTerm, sortConfig])

  const handleSort = (key: SortKey) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  const handleAssignConfirm = async (groupeId: string, studentIds: string[]) => {
    const selectedIds = new Set(studentIds)
    const currentGroupStudents = students.filter(student => student.groupId === groupeId)
    const assignments = students.filter(student => selectedIds.has(student.id))
    const unassignments = currentGroupStudents.filter(student => !selectedIds.has(student.id))

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
          groupId: null,
        }),
      ),
    ])

    await Promise.all([
      getGroups(),
      getStudents(),
      getTracks(),
      getPrograms(),
    ]).then(([groupModels, studentModels, trackModels, programModels]) => {
      const trackById = new Map<string, TrackResponse>(
        trackModels.map((track: TrackResponse) => [track.id, track]),
      )
      const programById = new Map<string, ProgramModel>(
        programModels.map((program: ProgramModel) => [program.id, program]),
      )

      setTrackOptions(
        trackModels.map(track => ({
          id: track.id,
          name: track.name,
          programName: programById.get(track.programId)?.name ?? 'Formation inconnue',
        })),
      )
      setGroupes(normalizeGroups(groupModels, trackById, programById, studentModels))
      setStudents(normalizeStudents(studentModels))
    })

    const groupe = groupes.find(item => item.id === groupeId)
    setSuccessMsg(
      `${assignments.length} étudiant${assignments.length > 1 ? 's' : ''} assigné${assignments.length > 1 ? 's' : ''} à ${groupe?.name}`,
    )
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const reloadData = async () => {
    const [groupModels, studentModels, trackModels, programModels]: [
      GroupModel[],
      StudentModel[],
      TrackResponse[],
      ProgramModel[],
    ] = await Promise.all([getGroups(), getStudents(), getTracks(), getPrograms()])

    const trackById = new Map<string, TrackResponse>(
      trackModels.map((track: TrackResponse) => [track.id, track]),
    )
    const programById = new Map<string, ProgramModel>(
      programModels.map((program: ProgramModel) => [program.id, program]),
    )

    setTrackOptions(
      trackModels.map(track => ({
        id: track.id,
        name: track.name,
        programName: programById.get(track.programId)?.name ?? 'Formation inconnue',
      })),
    )
    setGroupes(normalizeGroups(groupModels, trackById, programById, studentModels))
    setStudents(normalizeStudents(studentModels))
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

  const handleDeleteGroup = async (group: Group) => {
    const confirmDelete = window.confirm(
      `Supprimer le groupe ${group.name} ? Les étudiants du groupe seront désassignés.`,
    )

    if (!confirmDelete) return

    const affectedStudents = students.filter(student => student.groupId === group.id)
    await Promise.all(
      affectedStudents.map(student =>
        updateStudent(student.id, {
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          phone: student.phone,
          groupId: null,
        }),
      ),
    )

    await deleteGroup(group.id)
    await reloadData()
    setSuccessMsg(`Le groupe ${group.name} a été supprimé.`)
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
          <div className="badge badge-neutral badge-lg">
            {filteredAndSortedGroupes.length} groupe{filteredAndSortedGroupes.length > 1 ? 's' : ''}
          </div>
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
          onClose={() => setAssignGroupe(null)}
          onConfirm={handleAssignConfirm}
        />
      )}

      {groupFormMode && (
        <GroupFormModal
          isOpen={Boolean(groupFormMode)}
          mode={groupFormMode}
          group={groupToEdit}
          tracks={trackOptions}
          onClose={() => {
            setGroupFormMode(null)
            setGroupToEdit(null)
          }}
          onSubmit={groupFormMode === 'create' ? handleCreateGroup : handleEditGroup}
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
      trackName: track?.name ?? 'Parcours inconnu',
      programName: program?.name ?? 'Formation inconnue',
      studentCount: studentCountByGroupId[group.id] ?? 0,
    }
  })
}
