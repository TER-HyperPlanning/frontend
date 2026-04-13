import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useEditFiliereNameForm,
  type EditFiliereNameValues,
} from '@/hooks/filieres/useEditFiliereForm'
import TextField from '@/components/TextField'
import Button from '@/components/Button'
import { type FiliereSummary } from '@/types/formation'

interface EditFiliereModalProps {
  isOpen: boolean
  filiere: FiliereSummary | null
  onClose: () => void
  onSave: (values: EditFiliereNameValues) => Promise<void>
}

export default function EditFiliereModal({
  isOpen,
  filiere,
  onClose,
  onSave,
}: EditFiliereModalProps) {
  return (
    <AnimatePresence>
      {isOpen && filiere && (
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
            <RenameFiliereContent key={filiere.id} filiere={filiere} onClose={onClose} onSave={onSave} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface RenameFiliereContentProps {
  filiere: FiliereSummary
  onClose: () => void
  onSave: (values: EditFiliereNameValues) => Promise<void>
}

function RenameFiliereContent({ filiere, onClose, onSave }: RenameFiliereContentProps) {
  const form = useEditFiliereNameForm(filiere, async (values) => {
    await onSave(values)
  })

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Renommer la filière</h2>
        <button
          type="button"
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
          <form.Field name="nom">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-primary-900">Nom</label>
                <TextField
                  name={field.name}
                  value={field.state.value}
                  maxLength={200}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                />
                <p className="text-xs text-gray-400 text-right">{field.state.value.length}/200</p>
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
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-primary-900 hover:bg-primary-800"
                >
                  {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </>
  )
}
