import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export const addFormationSchema = z.object({
  nom: z.string().min(1, 'Le nom de la formation est requis'),
  filiere: z.string().min(1, 'La filière est requise'),
  niveau: z.string().min(1, 'Le niveau est requis'),
})

export type AddFormationValues = z.infer<typeof addFormationSchema>

export function useAddFormationForm(
  onSubmit: (values: AddFormationValues) => void,
) {
  return useForm({
    defaultValues: {
      nom: '',
      filiere: '',
      niveau: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })
}
