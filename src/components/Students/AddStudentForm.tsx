import { useState } from 'react'
import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { type CreateStudentRequest } from './types'

interface AddStudentFormProps {
  isOpen: boolean
  onClose: () => void
  defaultGroupId?: string
  submitting: boolean
  onCreate: (payload: CreateStudentRequest) => Promise<void>
  onValidationError: (message: string) => void
}

interface AddFormState {
  email: string
  firstName: string
  lastName: string
  phone: string
}

const initialForm: AddFormState = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
}

function slugifyNamePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase()
}

function buildStudentEmail(firstName: string, lastName: string): string {
  const first = slugifyNamePart(firstName)
  const last = slugifyNamePart(lastName)

  if (!first || !last) return ''
  return `${first}.${last}@etud.fr`
}

export default function AddStudentForm({
  isOpen,
  onClose,
  defaultGroupId,
  submitting,
  onCreate,
  onValidationError,
}: AddStudentFormProps) {
  const [form, setForm] = useState<AddFormState>(initialForm)

  const onFieldChange = (field: keyof AddFormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'firstName' || field === 'lastName') {
        next.email = buildStudentEmail(next.firstName, next.lastName)
      }
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.email || !form.firstName || !form.lastName) {
      onValidationError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!defaultGroupId) {
      onValidationError('Aucun groupe disponible pour créer un étudiant')
      return
    }

    try {
      await onCreate({
        email: form.email,
        password: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || null,
        groupId: defaultGroupId,
      })
      setForm(initialForm)
      onClose()
    } catch {
      // L'erreur est déjà gérée par le parent (toast).
    }
  }

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
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Nouvel étudiant</h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4">
              <TextField
                name="firstName"
                label="Prénom"
                value={form.firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                placeholder="Prénom"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                required
              />

              <TextField
                name="lastName"
                label="Nom"
                value={form.lastName}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                placeholder="Nom"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                required
              />

              <TextField
                name="email"
                type="email"
                label="Email"
                value={form.email}
                placeholder="prenom.nom@etud.fr"
                className="h-12 placeholder:text-gray-600 text-gray-800"
                readOnly
                required
              />

              <TextField
                name="password"
                type="password"
                label="mot de passe"
                value={form.email}
                className="h-12 placeholder:text-gray-600 text-gray-800"
                readOnly
                required
              />

              <TextField
                name="phone"
                label="Téléphone"
                value={form.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="Téléphone"
                className="h-12 placeholder:text-gray-600 text-gray-800"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                >
                Annuler
                </Button>
                <Button type="submit" disabled={submitting} className="bg-primary-900 hover:bg-primary-800">
                  {submitting ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
