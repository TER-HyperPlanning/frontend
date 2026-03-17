import { Search } from 'lucide-react'

interface GroupFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  formationFilter: string
  onFormationChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  formations: string[]
}

function GroupFilters({
  searchTerm,
  onSearchChange,
  formationFilter,
  onFormationChange,
  typeFilter,
  onTypeChange,
  formations,
}: GroupFiltersProps) {
  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="grow text-sm"
            />
          </label>

          <select
            value={formationFilter}
            onChange={e => onFormationChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Toutes les formations</option>
            {formations.map(formation => (
              <option key={formation} value={formation}>
                {formation}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => onTypeChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="FI">Formation Initiale (FI)</option>
            <option value="FA">Formation par Alternance (FA)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default GroupFilters
