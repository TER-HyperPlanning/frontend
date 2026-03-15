import { HiChevronDown, HiOutlineSearch } from 'react-icons/hi'
import Button from '@/components/Button'
import TextField from '@/components/TextField'

interface Props {
  searchTerm: string
  setSearchTerm: (v: string) => void
  filterStatut: string
  setFilterStatut: (v: string) => void
  showStatutMenu: boolean
  setShowStatutMenu: (v: boolean) => void
}

export default function TeachersFilters({
  searchTerm,
  setSearchTerm,
  filterStatut,
  setFilterStatut,
  showStatutMenu,
  setShowStatutMenu
}: Props) {

  const statutOptions = ['Associé', 'Vacataire', 'Permanent']

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full mb-6">

      <div className="w-full lg:w-1/3 relative">
        <TextField
          placeholder="Rechercher un enseignant"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          name="search"
          leftIcon={<HiOutlineSearch size={20} className="text-gray-400" />}
          className="h-12 shadow-sm border-none bg-white text-gray-800 placeholder:text-gray-400"
        />
      </div>

      <div className="relative">
        <Button
          variant="light"
          rightIcon={<HiChevronDown />}
          onClick={() => setShowStatutMenu(!showStatutMenu)}
          className="w-48 justify-between bg-gray-100 text-gray-800 border-none"
        >
          {filterStatut || 'Tous les statuts'}
        </Button>

        {showStatutMenu && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {statutOptions.map((statut) => (
              <div
                key={statut}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
                onClick={() => {
                  setFilterStatut(statut)
                  setShowStatutMenu(false)
                }}
              >
                {statut}
              </div>
            ))}

            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 font-medium"
              onClick={() => {
                setFilterStatut('')
                setShowStatutMenu(false)
              }}
            >
              Tous les statuts
            </div>
          </div>
        )}
      </div>

    </div>
  )
}