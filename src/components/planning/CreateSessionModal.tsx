import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import Button from '../Button'
import Toast from '../Toast'
import { useToast } from '@/hooks/useToast'
import { createSession } from '@/hooks/api/mock/sessionApi'

interface CreateSessionModalProps {
  onClose: () => void
  onCreated: () => Promise<void> | void
  onTopError: (message: string | null) => void
}

type TeacherOption = {
  id: string
  name: string
}

type GroupOption = {
  id: string
  name: string
  studentsCount: number
}

const TEACHERS: TeacherOption[] = [
  { id: 'prof_1', name: 'Jean Dupont' },
  { id: 'prof_2', name: 'Marie Lambert' },
]

const GROUPS: GroupOption[] = [
  { id: 'group_a1', name: 'Groupe A1', studentsCount: 28 },
  { id: 'group_b2', name: 'Groupe B2', studentsCount: 25 },
]

function getTodayLocalDateTime() {
  const now = new Date()
  const rounded = new Date(now)
  rounded.setMinutes(rounded.getMinutes() < 30 ? 30 : 60, 0, 0)
  if (rounded.getMinutes() === 0) {
    rounded.setHours(rounded.getHours() + 1)
  }

  const year = rounded.getFullYear()
  const month = String(rounded.getMonth() + 1).padStart(2, '0')
  const day = String(rounded.getDate()).padStart(2, '0')
  const hours = String(rounded.getHours()).padStart(2, '0')
  const minutes = String(rounded.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function CreateSessionModal({
  onClose,
  onCreated,
  onTopError,
}: CreateSessionModalProps) {
  const [title, setTitle] = useState('')
  const [teacherId, setTeacherId] = useState(TEACHERS[0]?.id ?? '')
  const [groupId, setGroupId] = useState(GROUPS[0]?.id ?? '')
  const [start, setStart] = useState(getTodayLocalDateTime())
  const [room, setRoom] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const { toast, showToast, hideToast } = useToast()

  const selectedTeacher = useMemo(
    () => TEACHERS.find((teacher) => teacher.id === teacherId) ?? null,
    [teacherId],
  )

  const selectedGroup = useMemo(
    () => GROUPS.find((group) => group.id === groupId) ?? null,
    [groupId],
  )

  const resetErrors = () => {
    setLocalError(null)
    onTopError(null)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async () => {
    resetErrors()

    if (!title.trim()) {
      const message = 'Le titre est obligatoire.'
      setLocalError(message)
      onTopError(message)
      return
    }

    if (!selectedTeacher || !selectedGroup) {
      const message = 'Veuillez sélectionner un enseignant et un groupe.'
      setLocalError(message)
      onTopError(message)
      return
    }

    const startDate = new Date(start)

    if (Number.isNaN(startDate.getTime())) {
      const message = 'Date invalide.'
      setLocalError(message)
      onTopError(message)
      return
    }

    setIsSubmitting(true)

    try {
      const success = await createSession({
        type: 'TD',
        moduleId: 'module_1',
        moduleName: title.trim(),
        start: startDate,
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.name,
        groupId: selectedGroup.id,
        group: selectedGroup.name,
        room: room.trim() || undefined,
        studentsCount: selectedGroup.studentsCount,
      })

      if (!success) {
        const message =
          'Impossible d’ajouter la séance. Vérifie les disponibilités ou les conflits.'
        setLocalError(message)
        onTopError(message)
        showToast(message, 'error')
        return
      }

      await onCreated()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div className="mx-4 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Ajouter une séance
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Exemple simple branché sur le mock.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-gray-100"
              aria-label="Fermer"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {localError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {localError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Ex: TD React avancé"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enseignant
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {TEACHERS.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Groupe
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Début
                </label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salle
                </label>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Ex: Salle 204"
                />
              </div>

            
             
              
            </div>

            
          </div>

          <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[#003A68] px-4 py-2 text-sm font-medium text-white hover:bg-[#002847] disabled:opacity-50"
            >
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}