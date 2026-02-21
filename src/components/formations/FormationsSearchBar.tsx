import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FILIERE_OPTIONS, NIVEAU_OPTIONS } from '@/types/formation'
import { cn } from '@/utils/cn'

interface FormationsSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filiereFilter: string
  onFiliereChange: (value: string) => void
  niveauFilter: string
  onNiveauChange: (value: string) => void
}

export default function FormationsSearchBar({
  searchQuery,
  onSearchChange,
  filiereFilter,
  onFiliereChange,
  niveauFilter,
  onNiveauChange,
}: FormationsSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une formation"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'input input-bordered w-full pl-10 bg-white text-gray-900',
            'placeholder:text-gray-400 border-gray-300 focus:border-primary-500',
          )}
        />
      </div>

      {/* Filter dropdowns */}
      <div className="flex gap-3">
        <select
          value={filiereFilter}
          onChange={(e) => onFiliereChange(e.target.value)}
          className="select select-bordered bg-white text-gray-700 border-gray-300 min-w-[140px]"
        >
          <option value="">Filière</option>
          {FILIERE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={niveauFilter}
          onChange={(e) => onNiveauChange(e.target.value)}
          className="select select-bordered bg-white text-gray-700 border-gray-300 min-w-[140px]"
        >
          <option value="">Niveau</option>
          {NIVEAU_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
