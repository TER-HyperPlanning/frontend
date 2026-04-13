import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import type { Group } from '../types'

interface FormationOption {
  id: string
  name: string
  trackId: string
}

interface GroupFormValues {
  name: string
  academicYear: string
  trackId: string
}

function getDefaultAcademicYear() {
  const currentYear = new Date().getFullYear()
  return `${currentYear}-${currentYear + 1}`
}

interface GroupFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  group?: Group | null
  formations: FormationOption[]
  onClose: () => void
  onSubmit: (values: GroupFormValues) => void | Promise<void>
}

interface FormState {
  name: string
  academicYear: string
  formationId: string
}

const EMPTY_VALUES: FormState = {
  name: '',
  academicYear: getDefaultAcademicYear(),
  formationId: '',
}

function GroupFormModal({ isOpen, mode, group, formations, onClose, onSubmit }: GroupFormModalProps) {
  const [values, setValues] = useState<FormState>(EMPTY_VALUES)
  const [error, setError] = useState<string | null>(null)
  const title = mode === 'create' ? 'Créer un groupe' : 'Modifier le groupe'

  useEffect(() => {
    if (!isOpen) return

    if (group) {
      setValues({
        name: group.name,
        academicYear: group.academicYear,
        formationId: group.programId ?? formations.find(formation => formation.trackId === group.trackId)?.id ?? '',
      })
    } else {
      setValues({
        ...EMPTY_VALUES,
        formationId: formations.length === 1 ? formations[0].id : '',
      })
    }
    setError(null)
  }, [group, isOpen, formations])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError('Le nom du groupe est obligatoire.')
      return
    }
    if (!values.academicYear.trim()) {
      setError("L'année académique est obligatoire.")
      return
    }
    if (!values.formationId.trim()) {
      setError('La formation est obligatoire.')
      return
    }

    const selectedFormation = formations.find(formation => formation.id === values.formationId)
    if (!selectedFormation?.trackId) {
      setError('Impossible de déterminer la formation associée à ce groupe.')
      return
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        academicYear: values.academicYear.trim(),
        trackId: selectedFormation.trackId,
      })

      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible d'enregistrer ce groupe."
      setError(message)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-xl p-0 overflow-hidden bg-base-100 border border-base-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{title}</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              Remplis les champs nom, année académique et formation.
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
              onChange={e => {
                setValues(prev => ({ ...prev, name: e.target.value }))
                if (error) setError(null)
              }}
              placeholder="Groupe A"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-2">Année académique</span>
            <input
              className="input input-bordered w-full"
              value={values.academicYear}
              onChange={e => {
                setValues(prev => ({ ...prev, academicYear: e.target.value }))
                if (error) setError(null)
              }}
              placeholder="2025-2026"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-2">Formation</span>
            <select
              className="select select-bordered w-full"
              value={values.formationId}
              onChange={e => {
                setValues(prev => ({ ...prev, formationId: e.target.value }))
                if (error) setError(null)
              }}
            >
              <option value="">Sélectionner une formation</option>
              {formations.map(formation => (
                <option key={formation.id} value={formation.id}>
                  {formation.name}
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
export type { GroupFormValues, FormationOption }
