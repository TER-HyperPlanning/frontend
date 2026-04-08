import { useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useEditSessionForm,
  type EditSessionValues,
} from '@/hooks/sessions/useEditSessionForm'
import { useCourseOptions } from '@/hooks/sessions/useCourseOptions'
import { useRoomOptions } from '@/hooks/sessions/useRoomOptions'
import { type SessionResponse, SESSION_TYPE_LABELS, SESSION_MODE_LABELS } from '@/types/session'
import TextField from '@/components/TextField'
import TextAreaField from '@/components/TextAreaField'
import Button from '@/components/Button'

interface EditSessionModalProps {
  isOpen: boolean
  session: SessionResponse | null
  onClose: () => void
  onEdit: (values: EditSessionValues) => Promise<boolean>
}

export default function EditSessionModal({
  isOpen,
  session,
  onClose,
  onEdit,
}: EditSessionModalProps) {
  const courseOptions = useCourseOptions()
  const roomOptions = useRoomOptions()

  return (
    <AnimatePresence>
      {isOpen && session && (
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
            <EditSessionContent
              key={session.id}
              session={session}
              courseOptions={courseOptions}
              roomOptions={roomOptions}
              onClose={onClose}
              onEdit={onEdit}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function findOptionByName(
  options: { value: string; label: string }[],
  name: string | null,
): string {
  if (!name) return ''
  const lower = name.toLowerCase()
  const match = options.find((o) => o.label.toLowerCase().includes(lower))
  return match?.value ?? ''
}

interface EditSessionContentProps {
  session: SessionResponse
  courseOptions: { value: string; label: string }[]
  roomOptions: { value: string; label: string }[]
  onClose: () => void
  onEdit: (values: EditSessionValues) => Promise<boolean>
}

function EditSessionContent({
  session,
  courseOptions,
  roomOptions,
  onClose,
  onEdit,
}: EditSessionContentProps) {
  const initialCourseId = useMemo(
    () => findOptionByName(courseOptions, session.course),
    [courseOptions, session.course],
  )
  const initialRoomId = useMemo(
    () => findOptionByName(roomOptions, session.room),
    [roomOptions, session.room],
  )

  const form = useEditSessionForm(session, initialCourseId, initialRoomId, async (values) => {
    const ok = await onEdit(values)
    if (!ok) throw new Error('edit failed')
  })

  useEffect(() => {
    if (initialCourseId && !form.state.values.courseId) {
      form.setFieldValue('courseId', initialCourseId)
    }
  }, [initialCourseId, form])

  useEffect(() => {
    if (initialRoomId && !form.state.values.roomId) {
      form.setFieldValue('roomId', initialRoomId)
    }
  }, [initialRoomId, form])

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">
          Modifier la Séance
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
