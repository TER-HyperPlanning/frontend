import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import type { ReactNode } from "react"
interface ErrorTextProps{
    error?:string | ReactNode
}
export const ErrorText = ({error}: ErrorTextProps) => {
  return (
     <>
       {error &&  <div className="flex items-center gap-0.5 mt-1 w-full">
                  <ExclamationCircleIcon className="size-4 text-red-500" />
                  <span className="label-text-alt text-xs font-semibold text-red-500">{error}</span>
             </div>}
     </>
  )
}
