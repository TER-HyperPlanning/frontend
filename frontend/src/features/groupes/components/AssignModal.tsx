import { Search, X, Check } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/Button'
import type { Group, Student } from '../types'

interface AssignModalProps {
  groupe: Group
  students: Student[]
  onClose: () => void
  onConfirm: (groupeId: string, studentIds: string[]) => void | Promise<void>
}

function AssignModal({ groupe, students, onClose, onConfirm }: AssignModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>(
    students.filter(student => student.groupId === groupe.id).map(student => student.id),
  )
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

  const toggleSelection = (studentId: string) => {
    setSelected(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId],
    )
  }

  const handleConfirm = () => {
    onConfirm(groupe.id, selected)
    modalRef.current?.close()
    onClose()
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
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>
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

export default AssignModal
