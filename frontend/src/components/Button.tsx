import { twMerge } from 'tailwind-merge';
import { type ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'light';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'filled',
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'btn transition-all duration-200 font-medium rounded-lg px-4 py-2 flex items-center justify-center gap-2';
  
  const variantClasses = {
    filled: 'bg-primary text-white border-0 hover:bg-primary-600 active:bg-primary-700',
    outlined: 'btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white',
    light: 'bg-gray-100 border border-gray-200 text-gray-800 hover:bg-gray-200',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const mergedClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    disabledClasses,
    className
  );

  return (
    <button
      type={type}
      className={mergedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </button>
  );
}
