import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useEditFormationForm,
  editFormationSchema,
  type EditFormationValues,
} from '@/hooks/formations/useEditFormationForm'
import TextField from '@/components/TextField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { type Formation, FILIERE_OPTIONS, NIVEAU_OPTIONS } from '@/types/formation'

interface EditFormationModalProps {
  isOpen: boolean
  formation: Formation | null
  onClose: () => void
  onEdit: (values: EditFormationValues) => void
}

export default function EditFormationModal({
  isOpen,
  formation,
  onClose,
  onEdit,
}: EditFormationModalProps) {
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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <EditFormationContent
              key={formation.id}
              formation={formation}
              onClose={onClose}
              onEdit={onEdit}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Private sub-component that owns the form hook ── */

interface EditFormationContentProps {
  formation: Formation
  onClose: () => void
  onEdit: (values: EditFormationValues) => void
}

function EditFormationContent({
  formation,
  onClose,
  onEdit,
}: EditFormationContentProps) {
  const form = useEditFormationForm(formation, (values) => {
    onEdit(values)
  })

  return (
    <>
      {/* Header */}
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
          {/* Nom de la formation */}
          <form.Field
            name="nom"
            validators={{ onChange: editFormationSchema.shape.nom }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-primary-900"
                >
                  Nom de la formation{' '}
                  <span className="text-red-500">*</span>
                </label>
                <TextField
                  name={field.name}
                  placeholder="Ex: Ingénierie logicielle pour le web"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                  error={field.state.meta.errors
                    .map((err) => (err ? err.message : ''))
                    .join(', ')}
                />
              </div>
            )}
          </form.Field>

          {/* Responsable */}
          <form.Field
            name="responsable"
            validators={{ onChange: editFormationSchema.shape.responsable }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-primary-900"
                >
                  Responsable <span className="text-red-500">*</span>
                </label>
                <TextField
                  name={field.name}
                  placeholder="Ex: Jean DUPONT"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                  error={field.state.meta.errors
                    .map((err) => (err ? err.message : ''))
                    .join(', ')}
                />
              </div>
            )}
          </form.Field>

          {/* Filière */}
          <form.Field
            name="filiere"
            validators={{ onChange: editFormationSchema.shape.filiere }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-primary-900"
                >
                  Filière <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name={field.name}
                  placeholder="Sélectionner une filière"
                  options={FILIERE_OPTIONS}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
                  className="bg-white text-gray-900 border-gray-300"
                  error={field.state.meta.errors
                    .map((err) => (err ? err.message : ''))
                    .join(', ')}
                />
              </div>
            )}
          </form.Field>

          {/* Niveau */}
          <form.Field
            name="niveau"
            validators={{ onChange: editFormationSchema.shape.niveau }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-primary-900"
                >
                  Niveau <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name={field.name}
                  placeholder="Sélectionner un niveau"
                  options={NIVEAU_OPTIONS}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
                  className="bg-white text-gray-900 border-gray-300"
                  error={field.state.meta.errors
                    .map((err) => (err ? err.message : ''))
                    .join(', ')}
                />
              </div>
            )}
          </form.Field>

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-primary-900 hover:bg-primary-800"
                >
                  {isSubmitting ? 'Modification...' : 'Modifier'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </>
  )
}
