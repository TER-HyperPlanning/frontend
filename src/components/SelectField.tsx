import { cn } from '@/utils/cn'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export interface SelectFieldProps {
  label?: string
  name: string
  options: { value: string; label: string }[]
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: () => void
  className?: string
  error?: string
}

export default function SelectField({
  label,
  name,
  options,
  placeholder,
  value,
  onChange,
  onBlur,
  className,
  error,
}: SelectFieldProps) {
  const baseClasses =
    'select select-bordered w-full transition-all duration-200'
  const errorClasses = error ? 'select-error border-red-500' : ''

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(baseClasses, errorClasses, className)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-0.5 mt-1">
          <ExclamationCircleIcon className="size-4 text-red-500" />
          <span className="label-text-alt text-xs font-semibold text-red-500">
            {error}
          </span>
        </div>
      )}
    </div>
  )
}
