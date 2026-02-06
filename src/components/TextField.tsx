import { twMerge } from 'tailwind-merge';
import { type ReactNode, type InputHTMLAttributes } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  leftIcon?: ReactNode;
  className?: string;
  error?: string;
  name: string;
}

export default function TextField({
  label,
  leftIcon,
  className,
  error,
  name,
  ...inputProps
}: TextFieldProps) {
  const baseInputClasses = 'input input-bordered w-full transition-all duration-200 bg-white/10 text-white placeholder:text-white/60';
  const errorClasses = error ? 'input-error border-red-500' : '';
  const iconPaddingClasses = leftIcon ? 'pl-10' : '';

  const mergedInputClasses = twMerge(
    baseInputClasses,
    errorClasses,
    iconPaddingClasses,
    className
  );

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200">
            {leftIcon}
          </div>
        )}
        <input
          id={name}
          name={name}
          className={mergedInputClasses}
          {...inputProps}
        />
      </div>
      {error && (
        <div className="flex items-center gap-0.5 mt-1">
          <ExclamationCircleIcon className="size-4 text-red-500" />
          <span className="label-text-alt text-xs font-semibold text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}
