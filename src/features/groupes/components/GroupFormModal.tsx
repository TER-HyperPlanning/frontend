import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import type { Group } from '../types'

interface TrackOption {
  id: string
  name: string
  programName: string
}

interface GroupFormValues {
  name: string
  academicYear: string
  trackId: string
}

interface GroupFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  group?: Group | null
  tracks: TrackOption[]
  onClose: () => void
  onSubmit: (values: GroupFormValues) => void | Promise<void>
}

const EMPTY_VALUES: GroupFormValues = {
  name: '',
  academicYear: '',
  trackId: '',
}

function GroupFormModal({ isOpen, mode, group, tracks, onClose, onSubmit }: GroupFormModalProps) {
  const [values, setValues] = useState<GroupFormValues>(EMPTY_VALUES)
  const [error, setError] = useState<string | null>(null)
  const title = mode === 'create' ? 'Créer un groupe' : 'Modifier le groupe'

  useEffect(() => {
    if (!isOpen) return

    if (group) {
      setValues({
        name: group.name,
        academicYear: group.academicYear,
        trackId: group.trackId,
      })
    } else {
      setValues(EMPTY_VALUES)
    }
    setError(null)
  }, [group, isOpen])

  const trackOptions = useMemo(
    () =>
      tracks.map(track => ({
        ...track,
        label: `${track.name} · ${track.programName}`,
      })),
    [tracks],
  )

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Le nom du groupe est obligatoire.')
      return
    }
    if (!values.academicYear.trim()) {
      setError("L'année académique est obligatoire.")
      return
    }
    if (!values.trackId.trim()) {
      setError('Le parcours est obligatoire.')
      return
    }

    await onSubmit({
      name: values.name.trim(),
      academicYear: values.academicYear.trim(),
      trackId: values.trackId,
    })

    onClose()
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-xl p-0 overflow-hidden bg-base-100 border border-base-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{title}</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              Remplis les champs name, academicYear et trackId.
            </p>
          </div>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-2">Nom du groupe</span>
            <input
              className="input input-bordered w-full"
              value={values.name}
              onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Groupe A"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-2">Année académique</span>
            <input
              className="input input-bordered w-full"
              value={values.academicYear}
              onChange={e => setValues(prev => ({ ...prev, academicYear: e.target.value }))}
              placeholder="L3, M1, M2..."
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-2">Parcours</span>
            <select
              className="select select-bordered w-full"
              value={values.trackId}
              onChange={e => setValues(prev => ({ ...prev, trackId: e.target.value }))}
            >
              <option value="">Sélectionner un parcours</option>
              {trackOptions.map(track => (
                <option key={track.id} value={track.id}>
                  {track.label}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outlined" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{mode === 'create' ? 'Créer' : 'Enregistrer'}</Button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

export default GroupFormModal
export type { GroupFormValues, TrackOption }
