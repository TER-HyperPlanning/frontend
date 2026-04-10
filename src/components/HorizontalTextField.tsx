import type { DetailedHTMLProps } from "react"
import { twMerge } from "tailwind-merge";

interface HorizontalTextFieldProps {
    label: string,
    error?:boolean
}

export const HorizontalTextField = ({ label, error, ...inputProps }: HorizontalTextFieldProps & Omit<DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "className">) => {
    const baseInputClasses = "input w-25"
    const errorClasses = error ? 'input-error border-red-500' : '';

    const mergedClasses = twMerge(
        baseInputClasses,
        errorClasses,
    )
    return (
        <div>
            <div className="flex justify-center gap-4">
                <label className='label'>
                    <span>{label}</span>
                    <input className={mergedClasses} {...inputProps} />
                </label>
              
            </div>

        </div>
    )
}
