import { Search, ArrowUpDown } from 'lucide-react'
import { SESSION_TYPE_LABELS } from '@/types/session'

interface SessionsSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  groupFilter: string
  onGroupChange: (value: string) => void
  allGroups: string[]
  dateSort: 'asc' | 'desc'
  onDateSortChange: (value: 'asc' | 'desc') => void
}

export default function SessionsSearchBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  groupFilter,
  onGroupChange,
  allGroups,
  dateSort,
  onDateSortChange,
}: SessionsSearchBarProps) {
  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher par module, groupe, description…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="grow text-sm"
            />
          </label>

          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Tous les types</option>
            {(Object.entries(SESSION_TYPE_LABELS) as [string, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={groupFilter}
            onChange={(e) => onGroupChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Tous les groupes</option>
            {allGroups.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onDateSortChange(dateSort === 'asc' ? 'desc' : 'asc')}
            className="btn btn-outline btn-sm h-full text-sm gap-2"
          >
            <ArrowUpDown size={16} />
            {dateSort === 'asc' ? 'Date croissante' : 'Date décroissante'}
          </button>
        </div>
      </div>
    </div>
  )
}
