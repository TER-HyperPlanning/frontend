import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

interface SelectItem {
  id: number | string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  items: SelectItem[];
  label?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { items, className, placeholder, children, value, defaultValue, onChange, ...props },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState(
      value !== undefined ? value : (defaultValue ?? "")
    );

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const isSelected = String(selectedValue) !== "";

    return (
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={handleSelectChange}
        className={cn(
          "select w-full max-w-xs",
          isSelected ? "bg-primary-900 text-white" : "bg-gray-200 text-gray-900",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.value}
          </option>
        ))}
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;