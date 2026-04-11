import { Search, X, Check } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/Button'
import type { Group, Student } from '../types'

interface AssignModalProps {
  groupe: Group
  students: Student[]
  availableGroups: Group[]
  maxStudents: number
  onClose: () => void
  onConfirm: (groupeId: string, studentIds: string[], transferGroupIdForRemoved: string | null) => void | Promise<void>
}

function AssignModal({ groupe, students, availableGroups, maxStudents, onClose, onConfirm }: AssignModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>(
    students.filter(student => student.groupId === groupe.id).map(student => student.id),
  )
  const [transferGroupId, setTransferGroupId] = useState('')
  const [modalError, setModalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    modalRef.current?.showModal()
  }, [])

  const filteredStudents = useMemo(
    () =>
      students.filter(student =>
        `${student.firstName} ${student.lastName} ${student.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [students, search],
  )

  const initialAssignedIds = useMemo(
    () => new Set(students.filter(student => student.groupId === groupe.id).map(student => student.id)),
    [students, groupe.id],
  )

  const deselectedAssignedCount = useMemo(
    () => Array.from(initialAssignedIds).filter(id => !selected.includes(id)).length,
    [initialAssignedIds, selected],
  )

  const initialAssignedCount = initialAssignedIds.size

  const sortedAvailableGroups = useMemo(
    () => [...availableGroups].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })),
    [availableGroups],
  )

  const toggleSelection = (studentId: string) => {
    if (!selected.includes(studentId) && selected.length >= maxStudents) {
      setModalError(`Capacite atteinte: maximum ${maxStudents} etudiants par groupe.`)
      return
    }

    setModalError(null)
    setSelected(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId],
    )
  }

  const handleConfirm = async () => {
    const isReducingOverCapacity =
      initialAssignedCount > maxStudents && selected.length < initialAssignedCount

    if (selected.length > maxStudents && !isReducingOverCapacity) {
      setModalError(`Capacite depassee: ${selected.length}/${maxStudents}.`)
      return
    }

    try {
      setIsSubmitting(true)
      setModalError(null)
      await onConfirm(groupe.id, selected, deselectedAssignedCount > 0 && transferGroupId ? transferGroupId : null)
      modalRef.current?.close()
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Operation impossible.'
      setModalError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
      <div className="modal-box w-full max-w-lg p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Assigner des étudiants</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              {groupe.name} — {groupe.academicYear} · {groupe.trackName}
            </p>
          </div>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose} disabled={isSubmitting}>
            <X size={18} />
          </button>
        </div>

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

        <div className="overflow-y-auto max-h-72 divide-y divide-base-200">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-base-content/50 text-sm">Aucun étudiant trouvé</div>
          ) : (
            filteredStudents.map(student => {
              const isSelected = selected.includes(student.id)
              return (
                <label
                  key={student.id}
                  className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-base-200/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={isSelected}
                    disabled={!isSelected && selected.length >= maxStudents}
                    onChange={() => toggleSelection(student.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-base-content/50 truncate">{student.email}</p>
                  </div>
                  {student.groupId && student.groupId !== groupe.id && (
                    <span className="badge badge-warning badge-sm shrink-0">Sera transféré</span>
                  )}
                  {student.groupId === groupe.id && (
                    <span className="badge badge-success badge-sm shrink-0">Dans ce groupe</span>
                  )}
                </label>
              )
            })
          )}
        </div>

        {deselectedAssignedCount > 0 && (
          <div className="px-6 py-3 border-t border-base-200 space-y-2">
            <p className="text-sm text-base-content/70">
              {deselectedAssignedCount} etudiant{deselectedAssignedCount > 1 ? 's' : ''} retire{deselectedAssignedCount > 1 ? 's' : ''} de ce groupe.
            </p>
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-2">Groupe de destination (optionnel)</span>
              <select
                className="select select-bordered w-full"
                value={transferGroupId}
                onChange={event => {
                  setTransferGroupId(event.target.value)
                  setModalError(null)
                }}
                disabled={isSubmitting}
              >
                <option value="">Retirer sans reassigner (sans groupe)</option>
                {sortedAvailableGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.academicYear}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200">
          <span className="text-sm text-base-content/60">
            {selected.length}/{maxStudents} etudiant{selected.length > 1 ? 's' : ''} selectionne{selected.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button variant="filled" leftIcon={<Check size={16} />} onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Traitement...' : 'Confirmer'}
            </Button>
          </div>
        </div>

        {modalError && (
          <div className="px-6 pb-4">
            <div className="alert alert-error">
              <span className="text-sm">{modalError}</span>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export default AssignModal
