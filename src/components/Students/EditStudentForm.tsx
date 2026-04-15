import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { type StudentResponse, type UpdateStudentRequest } from './types'

interface EditStudentFormProps {
  student: StudentResponse | null
  submitting: boolean
  onUpdate: (id: string, payload: UpdateStudentRequest) => Promise<void>
  onCancel: () => void
  onValidationError: (message: string) => void
}

interface EditFormState {
  email: string
  firstName: string
  lastName: string
  phone: string
}

const initialForm: EditFormState = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
}

export default function EditStudentForm({
  student,
  submitting,
  onUpdate,
  onCancel,
  onValidationError,
}: EditStudentFormProps) {
  const [form, setForm] = useState<EditFormState>(initialForm)

  useEffect(() => {
    if (!student) {
      setForm(initialForm)
      return
    }

    setForm({
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone ?? '',
    })
  }, [student])

  if (!student) return null

  const onFieldChange = (field: keyof EditFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.email || !form.firstName || !form.lastName) {
      onValidationError('Veuillez remplir tous les champs obligatoires')
      return
    }

    await onUpdate(student.id, {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || null,
      groupId: student.groupId,
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Modifier un étudiant</h2>
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4 flex flex-col gap-4">
            <div className="w-full">
              <TextField
                name="edit-firstName"
                label="Prénom"
                value={form.firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                placeholder="Prénom"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                required
              />
            </div>

            <div className="w-full">
              <TextField
                name="edit-lastName"
                label="Nom"
                value={form.lastName}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                placeholder="Nom"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                required
              />
            </div>

            <div className="w-full">
              <TextField
                name="edit-email"
                type="email"
                label="Email"
                value={form.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="email@exemple.com"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                required
              />
            </div>

            <div className="w-full">
              <TextField
                name="edit-phone"
                label="Téléphone"
                value={form.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="Téléphone"
                className="h-12 placeholder:text-gray-600 text-gray-800"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 mt-2">
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary-900 hover:bg-primary-800">
                {submitting ? 'Enregistrement...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
