import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useAddFormationForm,
  addFormationSchema,
  type AddFormationValues,
} from '@/hooks/formations/useAddFormationForm'
import TextField from '@/components/TextField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { FILIERE_OPTIONS, NIVEAU_OPTIONS } from '@/types/formation'

interface AddFormationModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: AddFormationValues) => void
}

export default function AddFormationModal({
  isOpen,
  onClose,
  onAdd,
}: AddFormationModalProps) {
  const form = useAddFormationForm((values) => {
    onAdd(values)
    form.reset()
  })

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                Nouvelle Formation
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
                  validators={{ onChange: addFormationSchema.shape.nom }}
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

                {/* Filière */}
                <form.Field
                  name="filiere"
                  validators={{ onChange: addFormationSchema.shape.filiere }}
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
                  validators={{ onChange: addFormationSchema.shape.niveau }}
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
                        {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                      </Button>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
