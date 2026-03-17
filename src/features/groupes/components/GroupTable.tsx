import { UserPlus } from 'lucide-react'
import Button from '@/components/Button'
import SortableHeader from './SortableHeader'
import type { Group, SortConfig, SortKey, Student } from '../types'

interface GroupTableProps {
  groupes: Group[]
  students: Student[]
  sortConfig: SortConfig
  onSort: (key: SortKey) => void
  onAssign: (groupe: Group) => void
}

function GroupTable({ groupes, students, sortConfig, onSort, onAssign }: GroupTableProps) {
  return (
    <table className="table table-zebra w-full">
      <thead>
        <tr className="text-base-content/60 text-xs uppercase">
          <th>Nom</th>
          <th>Type</th>
          <th>Formation</th>
          <th>Classe</th>
          <SortableHeader sortKey="capacite" sortConfig={sortConfig} onSort={onSort}>
            Capacité
          </SortableHeader>
          <SortableHeader sortKey="effectif" sortConfig={sortConfig} onSort={onSort}>
            Effectif
          </SortableHeader>
          <th>Remplissage</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groupes.map(groupe => {
          const ratio = groupe.effectif / groupe.capacite
          const assignedCount = students.filter(student => student.groupeId === groupe.id).length

          return (
            <tr key={groupe.id} className="hover">
              <td className="font-medium text-base-content">{groupe.nom}</td>
              <td>
                <span
                  className={`badge badge-sm font-medium ${
                    groupe.type === 'FI'
                      ? 'badge-primary badge-outline'
                      : 'badge-secondary badge-outline'
                  }`}
                >
                  {groupe.type}
                </span>
              </td>
              <td className="text-sm text-base-content/80">{groupe.formation}</td>
              <td className="text-sm text-base-content/80">{groupe.classe}</td>
              <td className="text-sm">{groupe.capacite}</td>
              <td className="text-sm">{groupe.effectif}</td>
              <td>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress w-16 h-2 ${
                      ratio > 0.9
                        ? 'progress-error'
                        : ratio > 0.7
                          ? 'progress-warning'
                          : 'progress-success'
                    }`}
                    value={ratio * 100}
                    max={100}
                  />
                  <span className="text-xs text-base-content/50">{Math.round(ratio * 100)}%</span>
                </div>
              </td>
              <td>
                <Button
                  variant="outlined"
                  leftIcon={<UserPlus size={15} />}
                  className="btn-sm text-xs"
                  onClick={() => onAssign(groupe)}
                >
                  Assigner
                  {assignedCount > 0 && (
                    <span className="badge badge-primary badge-sm ml-1">{assignedCount}</span>
                  )}
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default GroupTable
