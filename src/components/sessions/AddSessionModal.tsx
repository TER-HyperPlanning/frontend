import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useAddSessionForm,
  type AddSessionValues,
} from '@/hooks/sessions/useAddSessionForm'
import { useCourseOptions } from '@/hooks/sessions/useCourseOptions'
import { useGroupOptions } from '@/hooks/sessions/useGroupOptions'
import { useRoomOptions } from '@/hooks/sessions/useRoomOptions'
import { SESSION_TYPE_LABELS, SESSION_MODE_LABELS } from '@/types/session'
import TextField from '@/components/TextField'
import TextAreaField from '@/components/TextAreaField'
import Button from '@/components/Button'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: AddSessionValues) => Promise<boolean>
  /** Préremplit le groupe (ex. groupe choisi sur la page) */
  defaultGroupId?: string
  /** Préremplit la date de début (ex. double-click sur un slot) */
  defaultDate?: Date | null
  /** Préremplit la plage de temps (ex. heure de début et fin) */
  defaultDateRange?: { start: Date; end: Date } | null
}

export default function AddSessionModal({
  isOpen,
  onClose,
  onAdd,
  defaultGroupId = '',
  defaultDate = null,
  defaultDateRange = null,
}: AddSessionModalProps) {
  const form = useAddSessionForm(async (values) => {
    const ok = await onAdd(values)
    if (ok) form.reset()
  })

  useEffect(() => {
    if (isOpen && defaultGroupId) {
      form.setFieldValue('groupId', defaultGroupId)
    }
  }, [isOpen, defaultGroupId, form])

  useEffect(() => {
    if (isOpen && defaultDate) {
      const dateStr = defaultDate.toISOString().split('T')[0]
      form.setFieldValue('startDate', dateStr)
      form.setFieldValue('endDate', dateStr)
    }
  }, [isOpen, defaultDate, form])

  useEffect(() => {
    if (isOpen && defaultDateRange) {
      const startDateStr = defaultDateRange.start.toISOString().split('T')[0]
      const startTimeStr = defaultDateRange.start
        .toISOString()
        .split('T')[1]
        .slice(0, 5)

      const endDateStr = defaultDateRange.end.toISOString().split('T')[0]
      const endTimeStr = defaultDateRange.end.toISOString().split('T')[1].slice(0, 5)

      form.setFieldValue('startDate', startDateStr)
      form.setFieldValue('startTime', startTimeStr)
      form.setFieldValue('endDate', endDateStr)
      form.setFieldValue('endTime', endTimeStr)
    }
  }, [isOpen, defaultDateRange, form])

  const courseOptions = useCourseOptions()
  const groupOptions = useGroupOptions()
  const roomOptions = useRoomOptions()

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
                Nouvelle Séance
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
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="sessionType">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Type de séance
                        </label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value as 'CM' | 'TD' | 'TP')}
                          onBlur={() => field.handleBlur()}
                          className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                        >
                          {(Object.entries(SESSION_TYPE_LABELS) as [string, string][]).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="mode">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Mode
                        </label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value as 'PRESENTIAL' | 'ONLINE' | 'HYBRID')}
                          onBlur={() => field.handleBlur()}
                          className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                        >
                          {(Object.entries(SESSION_MODE_LABELS) as [string, string][]).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="courseId">
                  {(field) => (
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-primary-900">
                        Module
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                      >
                        <option value="">— Choisir un module —</option>
                        {courseOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="groupId">
                  {(field) => (
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-primary-900">
                        Groupe
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                      >
                        <option value="">— Aucun —</option>
                        {groupOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="roomId">
                  {(field) => (
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-primary-900">
                        Salle
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        className="select select-bordered w-full bg-white text-gray-900 border-gray-300"
                      >
                        <option value="">— Aucune —</option>
                        {roomOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="startDate">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Date de début
                        </label>
                        <TextField
                          type="date"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="startTime">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Heure de début
                        </label>
                        <TextField
                          type="time"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="endDate">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Date de fin
                        </label>
                        <TextField
                          type="date"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="endTime">
                    {(field) => (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-primary-900">
                          Heure de fin
                        </label>
                        <TextField
                          type="time"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-primary-900">
                        Description
                      </label>
                      <TextAreaField
                        name={field.name}
                        placeholder="Notes ou description de la séance…"
                        value={field.state.value}
                        rows={3}
                        maxLength={500}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right">
                        {field.state.value.length}/500
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
