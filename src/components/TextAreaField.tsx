import { type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string
  className?: string
  error?: string
  name: string
}

export default function TextAreaField({
  label,
  className,
  error,
  name,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className={cn(
          'textarea textarea-bordered w-full transition-all duration-200 bg-white/10 text-white placeholder:text-white/60',
          error && 'textarea-error border-red-500',
          className,
        )}
        {...textareaProps}
      />
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
