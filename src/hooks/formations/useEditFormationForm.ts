import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { type Formation, ENSEIGNANT_OPTIONS } from '@/types/formation'

export const editFormationSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom de la formation est requis')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  enseignantId: z.string().min(1, "L'enseignant responsable est requis"),
  programme: z
    .string()
    .min(1, 'Le programme est requis')
    .max(500, 'Le programme ne peut pas dépasser 500 caractères'),
  lieu: z
    .string()
    .min(1, 'Le lieu est requis')
    .max(150, 'Le lieu ne peut pas dépasser 150 caractères'),
  filiereId: z.string().min(1, 'La filière est requise'),
})

export type EditFormationValues = z.infer<typeof editFormationSchema>

function resolveEnseignantId(enseignantName: string): string {
  const option = ENSEIGNANT_OPTIONS.find((o) => o.label === enseignantName)
  return option?.value ?? ''
}

export function useEditFormationForm(
  formation: Formation,
  onSubmit: (values: EditFormationValues) => void,
) {
  return useForm({
    defaultValues: {
      nom: formation.nom,
      enseignantId: resolveEnseignantId(formation.enseignantResponsable),
      programme: formation.programme,
      lieu: formation.lieu,
      filiereId: formation.filiere.id,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })
}
