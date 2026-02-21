interface DropDownProps{
    label:string,
    items:string[]

}
export const DropDown = ({label, items}: DropDownProps) => {
  return (
<div className="dropdown">
  <div tabIndex={0} role="button" className="btn m-1">{label}</div>
  <ul tabIndex={-1} className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm">
    {items.map((item)=>(
        <li><a>{item}</a></li>
    ))}
  </ul>
</div>
  )
}
