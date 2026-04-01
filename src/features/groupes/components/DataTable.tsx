import { ReactNode } from 'react'
import SortableHeader from './SortableHeader'

export interface DataColumn<T> {
  key: string
  label: string
  render: (row: T, index: number) => ReactNode
  sortable?: boolean
  className?: string
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[]
  data: T[]
  sortConfig?: {
    key: string | null
    direction: 'asc' | 'desc'
  }
  onSort?: (key: string) => void
  loading?: boolean
  emptyState?: ReactNode
  className?: string
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  sortConfig = { key: null, direction: 'asc' },
  onSort,
  loading = false,
  emptyState,
  className = '',
}: DataTableProps<T>) {
  return (
    <table className={`table table-zebra w-full ${className}`}>
      <thead>
        <tr className="text-base-content/60 text-xs uppercase">
          {columns.map(column => (
            <th key={column.key} className={column.className}>
              {column.sortable ? (
                <SortableHeader
                  sortKey={column.key}
                  sortConfig={sortConfig as any}
                  onSort={onSort!}
                >
                  {column.label}
                </SortableHeader>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-8">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-8">
              {emptyState}
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={row.id} className="hover">
              {columns.map(column => (
                <td key={`${row.id}-${column.key}`} className={column.className}>
                  {column.render(row, index)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default DataTable
