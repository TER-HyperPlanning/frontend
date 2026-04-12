import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type SessionResponse, type SessionMode, type SessionType } from '@/types/session'

export const editSessionSchema = z.object({
  sessionType: z.enum(['CM', 'TD', 'TP']),
  mode: z.enum(['PRESENTIAL', 'ONLINE', 'HYBRID']),
  courseId: z.string().min(1, 'Le module est requis'),
  roomId: z.string(),
  startDate: z.string().min(1, 'La date de début est requise'),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endDate: z.string().min(1, 'La date de fin est requise'),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères'),
})

export type EditSessionValues = z.infer<typeof editSessionSchema>

interface EditSessionDefaults {
  sessionType: SessionType
  mode: SessionMode
  courseId: string
  roomId: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  description: string
}

function extractDate(dt: string): string {
  return dt.slice(0, 10)
}

function extractTime(dt: string): string {
  return dt.slice(11, 16)
}

export function useEditSessionForm(
  session: SessionResponse,
  initialCourseId: string,
  initialRoomId: string,
  onSubmit: (values: EditSessionValues) => Promise<void>,
) {
  const defaultValues: EditSessionDefaults = {
    sessionType: session.type,
    mode: session.mode,
    courseId: initialCourseId,
    roomId: initialRoomId,
    startDate: extractDate(session.startDateTime),
    startTime: extractTime(session.startDateTime),
    endDate: extractDate(session.endDateTime),
    endTime: extractTime(session.endDateTime),
    description: session.description ?? '',
  }

  return useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as EditSessionValues)
    },
  })
}
