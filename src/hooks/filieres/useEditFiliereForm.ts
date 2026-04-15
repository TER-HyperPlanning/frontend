import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type FiliereSummary } from '@/types/formation'

export const editFiliereNameSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom est obligatoire')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
})

export type EditFiliereNameValues = z.infer<typeof editFiliereNameSchema>

export function useEditFiliereNameForm(
  filiere: FiliereSummary,
  onSubmit: (values: EditFiliereNameValues) => Promise<void>,
) {
  return useForm({
    defaultValues: {
      nom: filiere.nom,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
