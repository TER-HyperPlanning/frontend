import { type ClassNameValue, twMerge } from "tailwind-merge"


export const cn = (...args: ClassNameValue[]) => {
    return twMerge(args)
}
