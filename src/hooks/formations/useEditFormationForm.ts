import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type Formation } from '@/types/formation'

export const editFormationSchema = z.object({
  nom: z.string().min(1, 'Le nom de la formation est requis'),
  responsable: z.string().min(1, 'Le responsable est requis'),
  filiere: z.string().min(1, 'La filière est requise'),
  niveau: z.string().min(1, 'Le niveau est requis'),
})

export type EditFormationValues = z.infer<typeof editFormationSchema>

export function useEditFormationForm(
  formation: Formation,
  onSubmit: (values: EditFormationValues) => void,
) {
  return useForm({
    defaultValues: {
      nom: formation.nom,
      responsable: formation.responsable,
      filiere: formation.filiere,
      niveau: formation.niveau,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })
}
