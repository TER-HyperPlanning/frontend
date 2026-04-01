import { UserPlus } from 'lucide-react'
import { useMemo } from 'react'
import Button from '@/components/Button'
import type { Group, SortConfig, SortKey, Student } from '../types'
import DataTable, { type DataColumn } from './DataTable'

interface GroupTableProps {
  groupes: Group[]
  students: Student[]
  sortConfig: SortConfig
  onSort: (key: SortKey) => void
  onAssign: (groupe: Group) => void
}

function GroupTable({ groupes, students, sortConfig, onSort, onAssign }: GroupTableProps) {
  const columns = useMemo<DataColumn<Group>[]>(
    () => [
      {
        key: 'nom',
        label: 'Nom',
        render: groupe => <span className="font-medium text-base-content">{groupe.nom}</span>,
      },
      {
        key: 'type',
        label: 'Type',
        render: groupe => (
          <span
            className={`badge badge-sm font-medium ${
              groupe.type === 'FI'
                ? 'badge-primary badge-outline'
                : 'badge-secondary badge-outline'
            }`}
          >
            {groupe.type}
          </span>
        ),
      },
      {
        key: 'formation',
        label: 'Formation',
        render: groupe => <span className="text-sm text-base-content/80">{groupe.formation}</span>,
      },
      {
        key: 'classe',
        label: 'Classe',
        render: groupe => <span className="text-sm text-base-content/80">{groupe.classe}</span>,
      },
      {
        key: 'capacite',
        label: 'Capacité',
        sortable: true,
        render: groupe => <span className="text-sm">{groupe.capacite}</span>,
      },
      {
        key: 'effectif',
        label: 'Effectif',
        sortable: true,
        render: groupe => <span className="text-sm">{groupe.effectif}</span>,
      },
      {
        key: 'remplissage',
        label: 'Remplissage',
        render: groupe => {
          const assignedCount = students.filter(student => student.groupeId === groupe.id).length
          const percentage = (assignedCount / groupe.capacite) * 100

          return (
            <div className="flex items-center gap-2">
              <progress
                className={`progress w-16 h-2 ${
                  assignedCount > groupe.capacite * 0.9
                    ? 'progress-error'
                    : assignedCount > groupe.capacite * 0.7
                      ? 'progress-warning'
                      : 'progress-success'
                }`}
                value={percentage}
                max={100}
              />
              <span className="text-xs text-base-content/50">{Math.round(percentage)}%</span>
            </div>
          )
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        render: groupe => (
          <Button
            variant="outlined"
            leftIcon={<UserPlus size={15} />}
            className="btn-sm text-xs"
            onClick={() => onAssign(groupe)}
          >
            Assigner
          </Button>
        ),
      },
    ],
    [students],
  )

  return (
    <DataTable<Group, SortKey>
      columns={columns}
      data={groupes}
      sortConfig={sortConfig}
      onSort={onSort}
    />
  )
}

export default GroupTable
