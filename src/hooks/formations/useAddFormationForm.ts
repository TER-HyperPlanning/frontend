import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const addFormationSchema = z.object({
  nom: z.string().max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  enseignantId: z.string(),
  programme: z.string().max(500, 'Le programme ne peut pas dépasser 500 caractères'),
  lieu: z.string().max(150, 'Le lieu ne peut pas dépasser 150 caractères'),
  filiereId: z.string(),
})

export type AddFormationValues = z.infer<typeof addFormationSchema>

export function useAddFormationForm(
  onSubmit: (values: AddFormationValues) => Promise<void>,
) {
  return useForm({
    defaultValues: {
      nom: '',
      enseignantId: '',
      programme: '',
      lieu: '',
      filiereId: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
