import Logo from '@/components/Logo'
import Button from '@/components/Button'
import FormationsSearchBar from '@/components/formations/FormationsSearchBar'
import { PlusIcon, BellIcon } from '@heroicons/react/24/outline'

interface FormationsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
}

export default function FormationsHeader({
  searchQuery,
  onSearchChange,
  onAddClick,
}: FormationsHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 gap-4">
      <Logo showText={true} className="h-10 text-primary-800 shrink-0" />

      <div className="flex-1 flex justify-center">
        <FormationsSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          onClick={onAddClick}
          leftIcon={<PlusIcon className="size-5" />}
          className="bg-primary-900 hover:bg-primary-800 text-white rounded-full px-5"
        >
          Nouvelle Formation
        </Button>
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <BellIcon className="size-6" />
        </button>
      </div>
    </header>
  )
}
