import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"

interface HorizontalTextFieldProps{
    inputClassName?:HTMLAttributes<HTMLDivElement>,
    label:string,
    className?:string
}

export const HorizontalTextField = ({label, inputClassName, className, ...inputProps}:HorizontalTextFieldProps & Omit< DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "className">) => {
    return (
        <div className="flex justify-center gap-4">
            <label className='label'>
                <span>{label}</span>
                <input  className='input w-25' {...inputProps} />
            </label>
        </div>
    )
}
