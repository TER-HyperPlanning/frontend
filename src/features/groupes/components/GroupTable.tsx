import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { useMemo } from 'react'
import Button from '@/components/Button'
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

const GROUP_CAPACITY_LIMIT = 30

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
        key: 'trackName',
        label: 'Parcours',
        sortable: true,
        render: groupe => <span className="text-sm text-base-content/80">{groupe.trackName}</span>,
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
          const ratio = groupe.studentCount / GROUP_CAPACITY_LIMIT
          const progressValue = Math.min(ratio * 100, 100)
          const progressLabel = `${Math.round(ratio * 100)}%`
          return (
            <div className="flex items-center gap-2">
              <progress
                className={`progress w-16 h-2 ${
                  ratio >= 1 ? 'progress-error' : ratio >= 0.8 ? 'progress-warning' : 'progress-success'
                }`}
                value={progressValue}
                max={100}
              />
              <span className="text-xs text-base-content/50">{progressLabel}</span>
            </div>
          )
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        render: groupe => (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              leftIcon={<Pencil size={15} />}
              className="btn-sm text-xs"
              onClick={() => onEdit(groupe)}
            >
              Modifier
            </Button>
            <Button
              variant="outlined"
              leftIcon={<UserPlus size={15} />}
              className="btn-sm text-xs"
              onClick={() => onAssign(groupe)}
            >
              Assigner
            </Button>
            <Button
              variant="outlined"
              leftIcon={<Trash2 size={15} />}
              className="btn-sm text-xs border-error text-error hover:bg-error hover:text-white"
              onClick={() => onDelete(groupe)}
            >
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    [onAssign, onEdit, onDelete],
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
