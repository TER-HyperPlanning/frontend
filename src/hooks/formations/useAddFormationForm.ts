import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const addFormationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  enseignantId: z.string().min(1, 'L\'enseignant responsable est requis'),
  programme: z.string().min(1, 'Le programme est requis').max(500, 'Le programme ne peut pas dépasser 500 caractères'),
  lieu: z.string().min(1, 'Le lieu est requis').max(150, 'Le lieu ne peut pas dépasser 150 caractères'),
  filiereId: z.string().min(1, 'La filière est requise'),
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
