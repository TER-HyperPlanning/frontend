import { Search } from 'lucide-react'

interface FilieresSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function FilieresSearchBar({
  searchQuery,
  onSearchChange,
}: FilieresSearchBarProps) {
  return (
    <div className="card bg-base-100 border border-base-200 mb-6">
      <div className="card-body py-4 px-5">
        <label className="input input-bordered flex items-center gap-2 w-full max-w-xl">
          <Search size={16} className="text-base-content/40" />
          <input
            type="text"
            placeholder="Rechercher une filière ou une formation…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="grow text-sm"
          />
        </label>
      </div>
    </div>
  )
}
