interface DropDownProps {
  label: string,
  items: string[]
  setSelectedItems?: React.Dispatch<React.SetStateAction<string>>,
  closeOnClick?: boolean
}
export const DropDown = ({ label, items, setSelectedItems, closeOnClick = false }: DropDownProps) => {
  const handleItemClick = (item: string) => {
    if (setSelectedItems) {
      setSelectedItems(item);
    }
    if (closeOnClick) {
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">{label}</div>
      <ul tabIndex={-1} className="dropdown-content bg-white menu rounded-box z-1 w-52 p-2 shadow-sm">
        {items.map((item) => (
          <li key={item} onClick={() => handleItemClick(item)}><a>{item}</a></li>
        )
        )
        }
      </ul>
    </div>
  )
}
