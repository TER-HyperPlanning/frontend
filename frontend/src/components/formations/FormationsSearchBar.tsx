import { Search } from 'lucide-react'

interface FormationsSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filiereFilter: string
  onFiliereChange: (value: string) => void
  filieres: { value: string; label: string }[]
}

export default function FormationsSearchBar({
  searchQuery,
  onSearchChange,
  filiereFilter,
  onFiliereChange,
  filieres,
}: FormationsSearchBarProps) {
  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher par nom ou filière…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="grow text-sm"
            />
          </label>

          <select
            value={filiereFilter}
            onChange={(e) => onFiliereChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Toutes les filières</option>
            {filieres.map((f) => (
              <option key={f.value} value={f.label}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
