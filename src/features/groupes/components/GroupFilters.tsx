import { Search } from 'lucide-react'

interface GroupFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  academicYearFilter: string
  onAcademicYearChange: (value: string) => void
  trackFilter: string
  onTrackChange: (value: string) => void
  academicYears: string[]
  tracks: string[]
}

function GroupFilters({
  searchTerm,
  onSearchChange,
  academicYearFilter,
  onAcademicYearChange,
  trackFilter,
  onTrackChange,
  academicYears,
  tracks,
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
            value={academicYearFilter}
            onChange={e => onAcademicYearChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Toutes les années</option>
            {academicYears.map(academicYear => (
              <option key={academicYear} value={academicYear}>
                {academicYear}
              </option>
            ))}
          </select>

          <select
            value={trackFilter}
            onChange={e => onTrackChange(e.target.value)}
            className="select select-bordered w-full text-sm"
          >
            <option value="all">Tous les parcours</option>
            {tracks.map(track => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default GroupFilters
