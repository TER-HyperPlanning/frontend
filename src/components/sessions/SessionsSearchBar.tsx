import { Search, ArrowUpDown } from 'lucide-react'
import { SESSION_TYPE_LABELS } from '@/types/session'
import { type GroupOption } from '@/hooks/sessions/useSessions'

interface SessionsSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  selectedGroupId: string
  onGroupChange: (groupId: string) => void
  groupOptions: GroupOption[]
  dateSort: 'asc' | 'desc'
  onDateSortChange: (value: 'asc' | 'desc') => void
  disabledFilters?: boolean
}

export default function SessionsSearchBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  selectedGroupId,
  onGroupChange,
  groupOptions,
  dateSort,
  onDateSortChange,
  disabledFilters = false,
}: SessionsSearchBarProps) {
  const controlH = 'h-12 min-h-12'

  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
          <label
            className={`input input-bordered flex items-center gap-2 shrink-0 ${controlH} ${disabledFilters ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Search size={16} className="text-base-content/40 shrink-0" aria-hidden />
            <input
              type="text"
              placeholder="Rechercher (module, description…)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={disabledFilters}
              className="grow text-sm min-w-0 h-full bg-transparent border-0 outline-none"
            />
          </label>

          <select
            value={selectedGroupId}
            onChange={(e) => onGroupChange(e.target.value)}
            className={`select select-bordered w-full text-sm ${controlH}`}
            aria-label="Groupe"
          >
            <option value="">— Choisir un groupe —</option>
            {groupOptions.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            disabled={disabledFilters}
            className={`select select-bordered w-full text-sm ${controlH} ${disabledFilters ? 'opacity-50' : ''}`}
          >
            <option value="all">Tous les types</option>
            {(Object.entries(SESSION_TYPE_LABELS) as [string, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onDateSortChange(dateSort === 'asc' ? 'desc' : 'asc')}
            disabled={disabledFilters}
            className={`btn btn-outline btn-sm justify-center ${controlH} px-3 text-sm gap-2 normal-case ${disabledFilters ? 'opacity-50' : ''}`}
          >
            <ArrowUpDown size={16} className="shrink-0" aria-hidden />
            <span className="truncate">{dateSort === 'asc' ? 'Date croissante' : 'Date décroissante'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
