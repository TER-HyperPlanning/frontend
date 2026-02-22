import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

interface FormationsSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function FormationsSearchBar({
  searchQuery,
  onSearchChange,
}: FormationsSearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-md">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500 pointer-events-none z-10" />
      <input
        type="text"
        placeholder="Rechercher par nom, enseignant ou filière…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          'input input-bordered w-full pl-10 bg-white text-gray-900',
          'placeholder:text-gray-400 border-gray-300 focus:border-primary-500',
        )}
      />
    </div>
  )
}
