import { createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import PageLayout from '@/layout/PageLayout'
import AssignModal from './components/AssignModal'
import EmptyGroupState from './components/EmptyGroupState'
import GroupFilters from './components/GroupFilters'
import GroupTable from './components/GroupTable'
import { mockGroupes, mockStudents } from './mockData'
import type { Group, SortKey, Student } from './types'

export const Route = createFileRoute('/(app)/groupes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [groupes, setGroupes] = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [loading, setLoading] = useState(true)
  const [formationFilter, setFormationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [assignGroupe, setAssignGroupe] = useState<Group | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroupes = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        setGroupes(mockGroupes)
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroupes()
  }, [])

  const formations = useMemo(() => [...new Set(groupes.map(groupe => groupe.formation))].sort(), [groupes])

  const filteredAndSortedGroupes = useMemo(() => {
    const filtered = groupes.filter(groupe => {
      const matchesFormation = formationFilter === 'all' || groupe.formation === formationFilter
      const matchesType = typeFilter === 'all' || groupe.type === typeFilter
      const matchesSearch =
        groupe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.classe.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesFormation && matchesType && matchesSearch
    })

    if (!sortConfig.key) {
      return filtered
    }

    return [...filtered].sort((first, second) => {
      const firstValue = first[sortConfig.key!]
      const secondValue = second[sortConfig.key!]

      return sortConfig.direction === 'asc'
        ? firstValue - secondValue
        : secondValue - firstValue
    })
  }, [groupes, formationFilter, typeFilter, searchTerm, sortConfig])

  const handleSort = (key: SortKey) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  const handleAssignConfirm = (groupeId: string, studentIds: string[]) => {
    setStudents(prev =>
      prev.map(student => {
        if (studentIds.includes(student.id)) {
          return { ...student, groupeId }
        }

        if (student.groupeId === groupeId && !studentIds.includes(student.id)) {
          return { ...student, groupeId: null }
        }

        return student
      }),
    )

    const groupe = groupes.find(item => item.id === groupeId)
    setSuccessMsg(
      `${studentIds.length} étudiant${studentIds.length > 1 ? 's' : ''} assigné${studentIds.length > 1 ? 's' : ''} à ${groupe?.nom}`,
    )
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <PageLayout className="p-6 overflow-y-auto">
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
        <div className="badge badge-neutral badge-lg">
          {filteredAndSortedGroupes.length} groupe{filteredAndSortedGroupes.length > 1 ? 's' : ''}
        </div>
      </div>

      <GroupFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        formationFilter={formationFilter}
        onFormationChange={setFormationFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        formations={formations}
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
              students={students}
              sortConfig={sortConfig}
              onSort={handleSort}
              onAssign={setAssignGroupe}
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
    </PageLayout>
  )
}
