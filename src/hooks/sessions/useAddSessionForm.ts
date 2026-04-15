import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type SessionMode, type SessionType } from '@/types/session'

export const addSessionSchema = z.object({
  sessionType: z.enum(['CM', 'TD', 'TP']),
  mode: z.enum(['PRESENTIAL', 'ONLINE', 'HYBRID']),
  courseId: z.string().min(1, 'Le module est requis'),
  roomId: z.string(),
  groupId: z.string(),
  startDate: z.string().min(1, 'La date de début est requise'),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endDate: z.string().min(1, 'La date de fin est requise'),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères'),
})

export type AddSessionValues = z.infer<typeof addSessionSchema>

interface AddSessionDefaults {
  sessionType: SessionType
  mode: SessionMode
  courseId: string
  roomId: string
  groupId: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  description: string
}

export function useAddSessionForm(
  onSubmit: (values: AddSessionValues) => Promise<void>,
) {
  const defaultValues: AddSessionDefaults = {
    sessionType: 'CM',
    mode: 'PRESENTIAL',
    courseId: '',
    roomId: '',
    groupId: '',
    startDate: '',
    startTime: '08:00',
    endDate: '',
    endTime: '10:00',
    description: '',
  }

  return useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as AddSessionValues)
    },
  })
}
