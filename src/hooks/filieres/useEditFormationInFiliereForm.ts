import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const editFormationInFiliereSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom est obligatoire')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  filiereId: z.string().min(1, 'Choisissez une filière'),
})

export type EditFormationInFiliereValues = z.infer<typeof editFormationInFiliereSchema>

/** Formation = Track ; filiereId = Program */
export interface EditFormationTarget {
  trackId: string
  name: string
  filiereId: string
}

export function useEditFormationInFiliereForm(
  target: EditFormationTarget,
  onSubmit: (values: EditFormationInFiliereValues) => Promise<void>,
) {
  return useForm({
    defaultValues: {
      nom: target.name,
      filiereId: target.filiereId,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
