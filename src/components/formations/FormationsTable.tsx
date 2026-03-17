import { type Formation } from '@/types/formation'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface FormationsTableProps {
  formations: Formation[]
  onEdit: (formation: Formation) => void
  onDelete: (formation: Formation) => void
}

export default function FormationsTable({
  formations,
  onEdit,
  onDelete,
}: FormationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="table w-full">
        <thead>
          <tr className="bg-gray-50 text-primary-900">
            <th className="font-semibold text-sm uppercase tracking-wide">
              Nom de la formation
            </th>
            <th className="font-semibold text-sm uppercase tracking-wide">
              Enseignant responsable
            </th>
            <th className="font-semibold text-sm uppercase tracking-wide">
              Programme
            </th>
            <th className="font-semibold text-sm uppercase tracking-wide">
              Lieu
            </th>
            <th className="font-semibold text-sm uppercase tracking-wide">
              Filière associée
            </th>
            <th className="font-semibold text-sm uppercase tracking-wide text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {formations.map((formation, index) => (
            <motion.tr
              key={formation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <td className="text-gray-800 font-medium">{formation.nom}</td>
              <td className="text-gray-600">
                {formation.enseignantResponsable}
              </td>
              <td className="text-gray-600">{formation.programme}</td>
              <td className="text-gray-600">{formation.lieu}</td>
              <td className="text-gray-600">{formation.filiere.nom}</td>
              <td>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(formation)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                  >
                    <PencilSquareIcon className="size-5" />
                  </button>
                  <button
                    onClick={() => onDelete(formation)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
          {formations.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-12">
                Aucune formation enregistrée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
