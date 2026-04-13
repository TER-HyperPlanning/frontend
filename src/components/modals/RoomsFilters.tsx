import { HiChevronDown } from 'react-icons/hi';
import Button from '@/components/Button';

interface Props {
  filterType: string;
  setFilterType: (v: string) => void;
  showTypeMenu: boolean;
  setShowTypeMenu: (v: boolean) => void;
}

export default function RoomsFilters({
  filterType,
  setFilterType,
  showTypeMenu,
  setShowTypeMenu,
}: Props) {

  const typeOptions = ['TD', 'COURS', 'INFO', 'AMPHITHEATRE'];

  const handleSelectType = (type: string) => {
    setFilterType(type);
    setShowTypeMenu(false);
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <Button
        variant="light"
        rightIcon={<HiChevronDown />}
        onClick={() => setShowTypeMenu(!showTypeMenu)}
        className="w-48 justify-between bg-gray-100 text-gray-800 border-none"
      >
        {filterType || 'Tous les types'}
      </Button>

      {/* DROPDOWN */}
      {showTypeMenu && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          
          {/* ALL */}
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 font-medium"
            onClick={() => handleSelectType('')}
          >
            Tous les types
          </div>

          {typeOptions.map((type) => (
            <div
              key={type}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
              onClick={() => handleSelectType(type)}
            >
              {type}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}