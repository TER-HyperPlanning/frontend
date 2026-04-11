import { useMemo, useState } from 'react'
import Button from '@/components/Button'
import type { Group } from '../types'

interface DeleteGroupTransferModalProps {
  isOpen: boolean
  group: Group | null
  candidateGroups: Group[]
  affectedStudentsCount: number
  isSubmitting: boolean
  errorMessage?: string | null
  onClose: () => void
  onConfirm: (targetGroupId: string | null) => void | Promise<void>
}

function DeleteGroupTransferModal({
  isOpen,
  group,
  candidateGroups,
  affectedStudentsCount,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteGroupTransferModalProps) {
  const [targetGroupId, setTargetGroupId] = useState('')
  const [selectionError, setSelectionError] = useState<string | null>(null)

  const sortedCandidates = useMemo(
    () => [...candidateGroups].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })),
    [candidateGroups],
  )

  if (!isOpen || !group) return null

  const handleConfirm = async () => {
    if (affectedStudentsCount > 0 && !targetGroupId) {
      setSelectionError('Selectionne un groupe de destination.')
      return
    }
    setSelectionError(null)
    await onConfirm(affectedStudentsCount > 0 ? targetGroupId : null)
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-xl p-0 overflow-hidden bg-base-100 border border-base-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Supprimer le groupe</h3>
            <p className="text-sm text-base-content/60 mt-0.5">{group.name}</p>
          </div>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose} type="button" disabled={isSubmitting}>
            x
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="alert alert-warning">
            <span className="font-semibold">Attention</span>
            <span className="text-sm">
              {affectedStudentsCount > 0
                ? `Ce groupe contient ${affectedStudentsCount} etudiant${affectedStudentsCount > 1 ? 's' : ''}. Tu dois d'abord les transferer vers un autre groupe.`
                : 'Ce groupe ne contient plus d etudiant. Tu peux confirmer la suppression.'}
            </span>
          </div>

          {affectedStudentsCount > 0 && (
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-2">Groupe de destination</span>
              <select
                className="select select-bordered w-full"
                value={targetGroupId}
                onChange={event => {
                  setTargetGroupId(event.target.value)
                  setSelectionError(null)
                }}
                disabled={isSubmitting || sortedCandidates.length === 0}
              >
                <option value="">Selectionner un groupe</option>
                {sortedCandidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} - {candidate.academicYear}
                  </option>
                ))}
              </select>
            </label>
          )}

          {affectedStudentsCount > 0 && sortedCandidates.length === 0 && (
            <p className="text-sm text-error">
              Aucun groupe de destination disponible. Cree d'abord un autre groupe.
            </p>
          )}

          {affectedStudentsCount > 0 && selectionError && <p className="text-sm text-error">{selectionError}</p>}

          {errorMessage && (
            <div className="alert alert-error">
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outlined" type="button" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="button"
              disabled={isSubmitting || (affectedStudentsCount > 0 && sortedCandidates.length === 0)}
              onClick={handleConfirm}
            >
              {isSubmitting ? 'Traitement...' : affectedStudentsCount > 0 ? 'Transferer puis supprimer' : 'Supprimer le groupe'}
            </Button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

export default DeleteGroupTransferModal
