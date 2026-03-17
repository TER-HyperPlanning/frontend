import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'


import type { Teacher } from './types';

interface Props {
  teachers: Teacher[]
  onEditClick: (teacher: Teacher) => void
  onDeleteClick: (teacher: Teacher) => void
}

export default function TeachersTable({ teachers, onEditClick, onDeleteClick }: Props) {

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
      <table className="w-full border-collapse bg-[#F4F6F8]">

        <thead>
          <tr className="text-[#003A68] font-semibold text-sm uppercase border-b border-gray-200">
            <th className="py-4 px-6 text-left">Nom</th>
            <th className="py-4 px-6 text-left">Prénom</th>
            <th className="py-4 px-6 text-left">Email</th>
            <th className="py-4 px-6 text-left">Statut</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-[#003A68] font-semibold">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">

                <td className="py-4 px-6">{teacher.nom}</td>
                <td className="py-4 px-6">{teacher.prenom}</td>
                <td className="py-4 px-6">{teacher.email}</td>

                <td className="py-4 px-6">
                  <span
                    className={`inline-block w-[100px] text-center py-1 rounded-[12px] font-semibold ${
                      teacher.statut === 'Associé'
                        ? 'bg-[#D3D3D3] text-gray-800'
                        : teacher.statut === 'Vacataire'
                        ? 'bg-[#A06BEF] text-white'
                        : 'bg-[#0072CE] text-white'
                    }`}
                  >
                    {teacher.statut}
                  </span>
                </td>

                <td className="py-4 px-6 text-right flex justify-end gap-2" >
                  <button className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-500" onClick={() => onEditClick(teacher)}>
                    <HiOutlinePencil size={20} />
                  </button>

                  <button className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500" onClick={() => onDeleteClick(teacher)}>
                    <HiOutlineTrash size={20} />
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-16 text-center text-gray-400">
                Aucun enseignant trouvé.
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  )
}