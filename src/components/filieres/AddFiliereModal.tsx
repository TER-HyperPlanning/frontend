import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useAddFiliereForm,
  type AddFiliereValues,
} from '@/hooks/filieres/useAddFiliereForm'
import TextField from '@/components/TextField'
import Button from '@/components/Button'

interface AddFiliereModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: AddFiliereValues) => Promise<void>
}

export default function AddFiliereModal({
  isOpen,
  onClose,
  onAdd,
}: AddFiliereModalProps) {
  const form = useAddFiliereForm(async (values) => {
    await onAdd(values)
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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Nouvelle filière</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Une filière peut regrouper plusieurs formations. Indiquez le nom de la nouvelle filière.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                className="space-y-4"
              >
                <form.Field name="nom">
                  {(field) => (
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-primary-900">
                        Nom de la filière
                      </label>
                      <TextField
                        name={field.name}
                        placeholder="Ex: Informatique"
                        value={field.state.value}
                        maxLength={200}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                      />
                      <p className="text-xs text-gray-400 text-right">
                        {field.state.value.length}/200
                      </p>
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
                        {isSubmitting ? 'Création…' : 'Créer'}
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
