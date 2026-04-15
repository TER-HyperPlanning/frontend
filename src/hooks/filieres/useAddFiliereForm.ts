import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const addFiliereSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom de la filière est obligatoire')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
})

export type AddFiliereValues = z.infer<typeof addFiliereSchema>

export function useAddFiliereForm(onSubmit: (values: AddFiliereValues) => Promise<void>) {
  return useForm({
    defaultValues: {
      nom: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
