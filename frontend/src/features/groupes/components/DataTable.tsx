import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import type { ReactNode } from 'react'

export interface DataColumn<TData, TSortKey extends string = string> {
  key: TSortKey | 'actions'
  label: string
  sortable?: boolean
  render?: (row: TData) => ReactNode
}

interface DataTableProps<TData, TSortKey extends string = string> {
  columns: DataColumn<TData, TSortKey>[]
  data: TData[]
  getRowKey: (row: TData) => string
  sortConfig?: {
    key: TSortKey | null
    direction: 'asc' | 'desc'
  }
  onSort?: (key: TSortKey) => void
}

function DataTable<TData, TSortKey extends string = string>({
  columns,
  data,
  getRowKey,
  sortConfig,
  onSort,
}: DataTableProps<TData, TSortKey>) {
  return (
    <Table>
      <TableHead>
        <TableRow className="text-base-content/60 text-xs uppercase">
          {columns.map(column => {
            const isSortable = Boolean(column.sortable && onSort)
            const isCurrentSort = sortConfig?.key === column.key

            return (
              <TableHeader key={column.label}>
                {isSortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-base-content"
                    onClick={() => onSort?.(column.key as TSortKey)}
                  >
                    {column.label}
                    {isCurrentSort && (
                      <span className="text-[10px] leading-none">
                        {sortConfig?.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map(row => (
          <TableRow key={getRowKey(row)}>
            {columns.map(column => (
              <TableCell key={column.label}>
                {column.render ? column.render(row) : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable