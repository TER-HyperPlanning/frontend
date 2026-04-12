import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const addFormationToFiliereSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom de la formation est obligatoire')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
})

export type AddFormationToFiliereValues = z.infer<typeof addFormationToFiliereSchema>

export function useAddFormationToFiliereForm(
  onSubmit: (values: AddFormationToFiliereValues) => Promise<void>,
) {
  return useForm({
    defaultValues: {
      nom: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
