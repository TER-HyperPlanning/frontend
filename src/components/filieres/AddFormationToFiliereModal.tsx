import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useAddFormationToFiliereForm,
  type AddFormationToFiliereValues,
} from '@/hooks/filieres/useAddFormationToFiliereForm'
import TextField from '@/components/TextField'
import Button from '@/components/Button'

interface AddFormationToFiliereModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: AddFormationToFiliereValues) => Promise<void>
}

export default function AddFormationToFiliereModal({
  isOpen,
  onClose,
  onAdd,
}: AddFormationToFiliereModalProps) {
  const form = useAddFormationToFiliereForm(async (values) => {
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
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Nouvelle formation</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              La formation sera rattachée uniquement à cette filière.
            </p>

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
                    <label className="text-sm font-semibold text-primary-900">Nom</label>
                    <TextField
                      name={field.name}
                      placeholder="Nom de la formation"
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
                      {isSubmitting ? 'Ajout…' : 'Ajouter'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
