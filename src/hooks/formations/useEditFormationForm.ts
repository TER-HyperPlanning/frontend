import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type Formation } from '@/types/formation'

export const editFormationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  enseignantId: z.string().min(1, 'L\'enseignant responsable est requis'),
  programme: z.string().min(1, 'Le programme est requis').max(500, 'Le programme ne peut pas dépasser 500 caractères'),
  lieu: z.string().min(1, 'Le lieu est requis').max(150, 'Le lieu ne peut pas dépasser 150 caractères'),
  filiereId: z.string().min(1, 'La filière est requise'),
})

export type EditFormationValues = z.infer<typeof editFormationSchema>

export function useEditFormationForm(
  formation: Formation,
  onSubmit: (values: EditFormationValues) => Promise<void>,
) {
  return useForm({
    defaultValues: {
      nom: formation.nom,
      enseignantId: formation.enseignantId,
      programme: formation.programme,
      lieu: formation.lieu,
      filiereId: formation.filiere.id,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
}
