import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { useMemo } from 'react'
import DataTable, { type DataColumn } from './DataTable'
import type { Group, SortConfig, SortKey } from '../types'

interface GroupTableProps {
  groupes: Group[]
  sortConfig: SortConfig
  onSort: (key: SortKey) => void
  onAssign: (groupe: Group) => void
  onEdit: (groupe: Group) => void
  onDelete: (groupe: Group) => void
}

function GroupTable({ groupes, sortConfig, onSort, onAssign, onEdit, onDelete }: GroupTableProps) {
  const columns = useMemo<DataColumn<Group, SortKey>[]>(
    () => [
      {
        key: 'name',
        label: 'Nom',
        sortable: true,
        render: groupe => <span className="font-medium text-base-content">{groupe.name}</span>,
      },
      {
        key: 'academicYear',
        label: 'Année',
        sortable: true,
        render: groupe => <span className="text-sm text-base-content/80">{groupe.academicYear}</span>,
      },
      {
        key: 'programName',
        label: 'Formation',
        sortable: true,
        render: groupe => <span className="text-sm text-base-content/80">{groupe.programName}</span>,
      },
      {
        key: 'studentCount',
        label: 'Étudiants',
        sortable: true,
        render: groupe => <span className="badge badge-neutral badge-outline badge-sm font-medium">{groupe.studentCount}</span>,
      },
      {
        key: 'actions',
        label: 'Remplissage',
        render: groupe => {
          const ratio = groupe.studentCount > 0 ? Math.min(groupe.studentCount / 30, 1) : 0
          return (
            <div className="flex items-center gap-2">
              <progress
                className={`progress w-16 h-2 ${
                  ratio > 0.9 ? 'progress-error' : ratio > 0.7 ? 'progress-warning' : 'progress-success'
                }`}
                value={ratio * 100}
                max={100}
              />
              <span className="text-xs text-base-content/50">{Math.round(ratio * 100)}%</span>
            </div>
          )
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        render: groupe => (
          <div className="flex items-center flex-nowrap gap-2 whitespace-nowrap">
            <div className="tooltip" data-tip="Modifier">
              <button
                type="button"
                className="btn btn-sm btn-outline btn-square"
                aria-label="Modifier"
                onClick={() => onEdit(groupe)}
              >
                <Pencil size={15} />
              </button>
            </div>

            <div className="tooltip" data-tip="Assigner">
              <button
                type="button"
                className="btn btn-sm btn-outline btn-square"
                aria-label="Assigner"
                onClick={() => onAssign(groupe)}
              >
                <UserPlus size={15} />
              </button>
            </div>

            <div className="tooltip" data-tip="Supprimer">
              <button
                type="button"
                className="btn btn-sm btn-outline btn-square border-error text-error hover:bg-error hover:text-white"
                aria-label="Supprimer"
                onClick={() => onDelete(groupe)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ),
      },
    ],
    [onAssign],
  )

  return (
    <DataTable<Group, SortKey>
      columns={columns}
      data={groupes}
      getRowKey={groupe => groupe.id}
      sortConfig={sortConfig}
      onSort={onSort}
    />
  )
}

export default GroupTable
