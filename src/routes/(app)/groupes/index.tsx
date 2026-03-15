import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ChevronUp, ChevronDown, Search, UserPlus, X, Check } from 'lucide-react'
import PageLayout from '@/layout/PageLayout'
import Button from '@/components/Button'

// ─── Types ───────────────────────────────────────────────────────────────────

type GroupType = 'FI' | 'FA'

interface Group {
  id: string
  nom: string
  type: GroupType
  formation: string
  classe: string
  capacite: number
  effectif: number
}

interface Student {
  id: string
  nom: string
  prenom: string
  email: string
  groupeId: string | null
}

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/(app)/groupes/')({
  component: RouteComponent,
})

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockStudents: Student[] = [
  { id: 's1', nom: 'Martin', prenom: 'Alice', email: 'alice.martin@univ.fr', groupeId: null },
  { id: 's2', nom: 'Dupont', prenom: 'Lucas', email: 'lucas.dupont@univ.fr', groupeId: null },
  { id: 's3', nom: 'Bernard', prenom: 'Emma', email: 'emma.bernard@univ.fr', groupeId: '1' },
  { id: 's4', nom: 'Leroy', prenom: 'Nathan', email: 'nathan.leroy@univ.fr', groupeId: null },
  { id: 's5', nom: 'Moreau', prenom: 'Chloé', email: 'chloe.moreau@univ.fr', groupeId: '2' },
  { id: 's6', nom: 'Simon', prenom: 'Hugo', email: 'hugo.simon@univ.fr', groupeId: null },
  { id: 's7', nom: 'Laurent', prenom: 'Inès', email: 'ines.laurent@univ.fr', groupeId: null },
  { id: 's8', nom: 'Petit', prenom: 'Théo', email: 'theo.petit@univ.fr', groupeId: '1' },
]

const mockGroupes: Group[] = [
  { id: '1', nom: 'Groupe A', type: 'FI', formation: 'Informatique', classe: 'L3', capacite: 30, effectif: 28 },
  { id: '2', nom: 'Groupe B', type: 'FA', formation: 'Informatique', classe: 'M1', capacite: 25, effectif: 23 },
  { id: '3', nom: 'Groupe C', type: 'FI', formation: 'Mathématiques', classe: 'L2', capacite: 35, effectif: 32 },
  { id: '4', nom: 'Groupe D', type: 'FA', formation: 'Physique', classe: 'M2', capacite: 20, effectif: 18 },
  { id: '5', nom: 'Groupe E', type: 'FI', formation: 'Informatique', classe: 'L1', capacite: 40, effectif: 35 },
]

// ─── GroupFilters ─────────────────────────────────────────────────────────────

interface GroupFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  formationFilter: string
  onFormationChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  formations: string[]
  totalVisible: number
}

function GroupFilters({
  searchTerm,
  onSearchChange,
  formationFilter,
  onFormationChange,
  typeFilter,
  onTypeChange,
  formations,
  totalVisible,
}: GroupFiltersProps) {
  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="grow text-sm"
            />
          </label>

          <select
            value={formationFilter}
            onChange={e => onFormationChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Toutes les formations</option>
            {formations.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => onTypeChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="FI">Formation Initiale (FI)</option>
            <option value="FA">Formation par Alternance (FA)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// ─── SortableHeader ───────────────────────────────────────────────────────────

interface SortableHeaderProps {
  children: React.ReactNode
  sortKey: 'capacite' | 'effectif'
  sortConfig: { key: 'capacite' | 'effectif' | null; direction: 'asc' | 'desc' }
  onSort: (key: 'capacite' | 'effectif') => void
}

function SortableHeader({ children, sortKey, sortConfig, onSort }: SortableHeaderProps) {
  return (
    <th className="cursor-pointer select-none" onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          <ChevronUp
            size={11}
            className={
              sortConfig.key === sortKey && sortConfig.direction === 'asc'
                ? 'text-primary'
                : 'text-base-content/20'
            }
          />
          <ChevronDown
            size={11}
            className={`-mt-0.5 ${
              sortConfig.key === sortKey && sortConfig.direction === 'desc'
                ? 'text-primary'
                : 'text-base-content/20'
            }`}
          />
        </div>
      </div>
    </th>
  )
}

// ─── AssignModal ──────────────────────────────────────────────────────────────

interface AssignModalProps {
  groupe: Group
  students: Student[]
  onClose: () => void
  onConfirm: (groupeId: string, studentIds: string[]) => void
}

function AssignModal({ groupe, students, onClose, onConfirm }: AssignModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>(
    students.filter(s => s.groupeId === groupe.id).map(s => s.id),
  )
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    modalRef.current?.showModal()
  }, [])

  const filtered = useMemo(
    () =>
      students.filter(s =>
        `${s.prenom} ${s.nom} ${s.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [students, search],
  )

  const toggle = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]))
  }

  const handleConfirm = () => {
    onConfirm(groupe.id, selected)
    modalRef.current?.close()
    onClose()
  }

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
      <div className="modal-box w-full max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Assigner des étudiants</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              {groupe.nom} — {groupe.formation} {groupe.classe}
            </p>
          </div>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-base-200">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="grow text-sm"
            />
          </label>
        </div>

        {/* Student list */}
        <div className="overflow-y-auto max-h-72 divide-y divide-base-200">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-base-content/50 text-sm">Aucun étudiant trouvé</div>
          ) : (
            filtered.map(student => {
              const isSelected = selected.includes(student.id)
              return (
                <label
                  key={student.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-base-200/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={isSelected}
                    onChange={() => toggle(student.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content">
                      {student.prenom} {student.nom}
                    </p>
                    <p className="text-xs text-base-content/50 truncate">{student.email}</p>
                  </div>
                  {student.groupeId && student.groupeId !== groupe.id && (
                    <span className="badge badge-warning badge-sm shrink-0">Déjà assigné</span>
                  )}
                  {student.groupeId === groupe.id && (
                    <span className="badge badge-success badge-sm shrink-0">Dans ce groupe</span>
                  )}
                </label>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200">
          <span className="text-sm text-base-content/60">
            {selected.length} étudiant{selected.length > 1 ? 's' : ''} sélectionné
            {selected.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="filled" leftIcon={<Check size={16} />} onClick={handleConfirm}>
              Confirmer
            </Button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  )
}

// ─── GroupTable ─────────────────────────────────────────────────────────────────

interface GroupTableProps {
  groupes: Group[]
  students: Student[]
  sortConfig: { key: 'capacite' | 'effectif' | null; direction: 'asc' | 'desc' }
  onSort: (key: 'capacite' | 'effectif') => void
  onAssign: (groupe: Group) => void
}

function GroupTable({ groupes, students, sortConfig, onSort, onAssign }: GroupTableProps) {
  return (
    <table className="table table-zebra w-full">
      <thead>
        <tr className="text-base-content/60 text-xs uppercase">
          <th>Nom</th>
          <th>Type</th>
          <th>Formation</th>
          <th>Classe</th>
          <SortableHeader sortKey="capacite" sortConfig={sortConfig} onSort={onSort}>
            Capacité
          </SortableHeader>
          <SortableHeader sortKey="effectif" sortConfig={sortConfig} onSort={onSort}>
            Effectif
          </SortableHeader>
          <th>Remplissage</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groupes.map(groupe => {
          const ratio = groupe.effectif / groupe.capacite
          const assignedCount = students.filter(s => s.groupeId === groupe.id).length
          return (
            <tr key={groupe.id} className="hover">
              <td className="font-medium text-base-content">{groupe.nom}</td>
              <td>
                <span
                  className={`badge badge-sm font-medium ${
                    groupe.type === 'FI'
                      ? 'badge-primary badge-outline'
                      : 'badge-secondary badge-outline'
                  }`}
                >
                  {groupe.type}
                </span>
              </td>
              <td className="text-sm text-base-content/80">{groupe.formation}</td>
              <td className="text-sm text-base-content/80">{groupe.classe}</td>
              <td className="text-sm">{groupe.capacite}</td>
              <td className="text-sm">{groupe.effectif}</td>
              <td>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress w-16 h-2 ${
                      ratio > 0.9
                        ? 'progress-error'
                        : ratio > 0.7
                          ? 'progress-warning'
                          : 'progress-success'
                    }`}
                    value={ratio * 100}
                    max={100}
                  />
                  <span className="text-xs text-base-content/50">{Math.round(ratio * 100)}%</span>
                </div>
              </td>
              <td>
                <Button
                  variant="outlined"
                  leftIcon={<UserPlus size={15} />}
                  className="btn-sm text-xs"
                  onClick={() => onAssign(groupe)}
                >
                  Assigner
                  {assignedCount > 0 && (
                    <span className="badge badge-primary badge-sm ml-1">{assignedCount}</span>
                  )}
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── EmptyGroupState ─────────────────────────────────────────────────────────────

function EmptyGroupState() {
  return (
    <div className="text-center py-16">
      <div className="text-base-content/30 mb-3">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <p className="text-base-content/50 text-sm">Aucun groupe ne correspond aux critères.</p>
    </div>
  )
}

// ─── RouteComponent ───────────────────────────────────────────────────────────

function RouteComponent() {
  const [groupes, setGroupes] = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [loading, setLoading] = useState(true)
  const [formationFilter, setFormationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: 'capacite' | 'effectif' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [assignGroupe, setAssignGroupe] = useState<Group | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroupes = async () => {
      setLoading(true)
      try {
        // TODO: remplacer par l'appel à l'API GetGroupes
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

  const formations = useMemo(() => [...new Set(groupes.map(g => g.formation))].sort(), [groupes])

  const filteredAndSortedGroupes = useMemo(() => {
    let filtered = groupes.filter(groupe => {
      const matchesFormation = formationFilter === 'all' || groupe.formation === formationFilter
      const matchesType = typeFilter === 'all' || groupe.type === typeFilter
      const matchesSearch =
        groupe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupe.classe.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFormation && matchesType && matchesSearch
    })
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!]
        const bVal = b[sortConfig.key!]
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      })
    }
    return filtered
  }, [groupes, formationFilter, typeFilter, searchTerm, sortConfig])

  const handleSort = (key: 'capacite' | 'effectif') => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  const handleAssignConfirm = (groupeId: string, studentIds: string[]) => {
    // TODO: remplacer par l'appel API AssignStudents
    setStudents(prev =>
      prev.map(s => {
        if (studentIds.includes(s.id)) return { ...s, groupeId }
        if (s.groupeId === groupeId && !studentIds.includes(s.id)) return { ...s, groupeId: null }
        return s
      }),
    )
    const groupe = groupes.find(g => g.id === groupeId)
    setSuccessMsg(
      `${studentIds.length} étudiant${studentIds.length > 1 ? 's' : ''} assigné${studentIds.length > 1 ? 's' : ''} à ${groupe?.nom}`,
    )
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <PageLayout className="p-6 overflow-y-auto">
      {/* Toast succès */}
      {successMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg">
            <Check size={16} />
            <span className="text-sm">{successMsg}</span>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Gestion des Groupes</h1>
          <p className="text-sm text-base-content/60 mt-1">Gérez et organisez les groupes d'étudiants</p>
        </div>
        <div className="badge badge-neutral badge-lg">
          {filteredAndSortedGroupes.length} groupe{filteredAndSortedGroupes.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtres */}
      <GroupFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        formationFilter={formationFilter}
        onFormationChange={setFormationFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        formations={formations}
        totalVisible={filteredAndSortedGroupes.length}
      />

      {/* Tableau */}
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

      {/* Modal assignation */}
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
