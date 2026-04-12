import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useEditFormationForm,
  editFormationSchema,
  type EditFormationValues,
} from '@/hooks/formations/useEditFormationForm'
import { useTeacherOptions } from '@/hooks/formations/useTeacherOptions'
import { useTrackOptions } from '@/hooks/formations/useTrackOptions'
import TextField from '@/components/TextField'
import TextAreaField from '@/components/TextAreaField'
import Button from '@/components/Button'
import { type Formation } from '@/types/formation'

interface EditFormationModalProps {
  isOpen: boolean
  formation: Formation | null
  onClose: () => void
  onEdit: (values: EditFormationValues) => Promise<void>
}

export default function EditFormationModal({
  isOpen,
  formation,
  onClose,
  onEdit,
}: EditFormationModalProps) {
  const enseignantOptions = useTeacherOptions()
  const filiereOptions = useTrackOptions()

  return (
    <AnimatePresence>
      {isOpen && formation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <EditFormationContent
              key={formation.id}
              formation={formation}
              enseignantOptions={enseignantOptions}
              filiereOptions={filiereOptions}
              onClose={onClose}
              onEdit={onEdit}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface EditFormationContentProps {
  formation: Formation
  enseignantOptions: { value: string; label: string }[]
  filiereOptions: { value: string; label: string }[]
  onClose: () => void
  onEdit: (values: EditFormationValues) => Promise<void>
}

function EditFormationContent({
  formation,
  enseignantOptions,
  filiereOptions,
  onClose,
  onEdit,
}: EditFormationContentProps) {
  const form = useEditFormationForm(formation, async (values) => {
    await onEdit(values)
  })

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">
          Modifier la Formation
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="nom"
            validators={{ onChange: editFormationSchema.shape.nom }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">
                  Nom de la formation <span className="text-error">*</span>
                </label>
                <TextField
                  name={field.name}
                  placeholder="Ex: Ingénierie logicielle pour le web"
                  value={field.state.value}
                  maxLength={150}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-error">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-gray-400 text-right">
                  {field.state.value.length}/150
                </p>
              </div>
            )}
          </form.Field>

          <form.Field
            name="enseignantId"
            validators={{ onChange: editFormationSchema.shape.enseignantId }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">
                  Enseignant responsable <span className="text-error">*</span>
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
                  className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                >
                  <option value="">— Choisir —</option>
                  {enseignantOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="programme"
            validators={{ onChange: editFormationSchema.shape.programme }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">
                  Programme <span className="text-error">*</span>
                </label>
                <TextAreaField
                  name={field.name}
                  placeholder="Décrivez le programme de la formation…"
                  value={field.state.value}
                  rows={4}
                  maxLength={500}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 resize-none"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-error">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-gray-400 text-right">
                  {field.state.value.length}/500
                </p>
              </div>
            )}
          </form.Field>

          <form.Field
            name="lieu"
            validators={{ onChange: editFormationSchema.shape.lieu }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">
                  Lieu <span className="text-error">*</span>
                </label>
                <TextField
                  name={field.name}
                  placeholder="Ex: Campus Évry, Bâtiment IBGBI"
                  value={field.state.value}
                  maxLength={150}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-error">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-gray-400 text-right">
                  {field.state.value.length}/150
                </p>
              </div>
            )}
          </form.Field>

          <form.Field
            name="filiereId"
            validators={{ onChange: editFormationSchema.shape.filiereId }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">
                  Filière <span className="text-error">*</span>
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
                  className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                >
                  <option value="">— Choisir —</option>
                  {filiereOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
            >
              Annuler
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-primary-900 hover:bg-primary-800"
                >
                  {isSubmitting ? 'Modification…' : 'Modifier'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </>
  )
}
