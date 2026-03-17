import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SortConfig, SortKey } from '../types'

interface SortableHeaderProps {
  children: ReactNode
  sortKey: SortKey
  sortConfig: SortConfig
  onSort: (key: SortKey) => void
}

function SortableHeader({ children, sortKey, sortConfig, onSort }: SortableHeaderProps) {
  return (
    <th className="cursor-pointer select-none" onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          <ChevronUp
            size={11}
            className={
              sortConfig.key === sortKey && sortConfig.direction === 'asc'
                ? 'text-primary'
                : 'text-base-content/20'
            }
          />
          <ChevronDown
            size={11}
            className={`-mt-0.5 ${
              sortConfig.key === sortKey && sortConfig.direction === 'desc'
                ? 'text-primary'
                : 'text-base-content/20'
            }`}
          />
        </div>
      </div>
    </th>
  )
}

export default SortableHeader
