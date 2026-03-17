import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }: SearchBarProps) {
    return (
        <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0b3b60]" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-none bg-[#f4f7f9] text-sm text-[#0b3b60] font-medium placeholder:text-[#0b3b60]/70 focus:outline-none focus:ring-2 focus:ring-[#0b3b60]/20 transition-all duration-200"
            />
        </div>
    )
}
