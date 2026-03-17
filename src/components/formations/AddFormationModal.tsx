import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useAddFormationForm,
  addFormationSchema,
  type AddFormationValues,
} from '@/hooks/formations/useAddFormationForm'
import TextField from '@/components/TextField'
import TextAreaField from '@/components/TextAreaField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { FILIERE_OPTIONS, ENSEIGNANT_OPTIONS } from '@/types/formation'

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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                {/* Nom — texte, max 150 */}
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
                        maxLength={150}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                        error={field.state.meta.errors
                          .map((err) => (err ? err.message : ''))
                          .join(', ')}
                      />
                      <p className="text-xs text-gray-400 text-right">
                        {field.state.value.length}/150
                      </p>
                    </div>
                  )}
                </form.Field>

                {/* Enseignant responsable — liste déroulante */}
                <form.Field
                  name="enseignantId"
                  validators={{
                    onChange: addFormationSchema.shape.enseignantId,
                  }}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-primary-900"
                      >
                        Enseignant responsable{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        name={field.name}
                        placeholder="Sélectionner un enseignant"
                        options={ENSEIGNANT_OPTIONS}
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

                {/* Programme — texte long, max 500 */}
                <form.Field
                  name="programme"
                  validators={{ onChange: addFormationSchema.shape.programme }}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-primary-900"
                      >
                        Programme <span className="text-red-500">*</span>
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
                        error={field.state.meta.errors
                          .map((err) => (err ? err.message : ''))
                          .join(', ')}
                      />
                      <p className="text-xs text-gray-400 text-right">
                        {field.state.value.length}/500
                      </p>
                    </div>
                  )}
                </form.Field>

                {/* Lieu — texte, max 150 */}
                <form.Field
                  name="lieu"
                  validators={{ onChange: addFormationSchema.shape.lieu }}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-primary-900"
                      >
                        Lieu <span className="text-red-500">*</span>
                      </label>
                      <TextField
                        name={field.name}
                        placeholder="Ex: Campus Évry, Bâtiment IBGBI"
                        value={field.state.value}
                        maxLength={150}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300"
                        error={field.state.meta.errors
                          .map((err) => (err ? err.message : ''))
                          .join(', ')}
                      />
                      <p className="text-xs text-gray-400 text-right">
                        {field.state.value.length}/150
                      </p>
                    </div>
                  )}
                </form.Field>

                {/* Filière — liste déroulante */}
                <form.Field
                  name="filiereId"
                  validators={{ onChange: addFormationSchema.shape.filiereId }}
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

                {/* Boutons : Annuler + Créer */}
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
