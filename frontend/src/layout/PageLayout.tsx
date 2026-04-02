import { cn } from "@/utils/cn"

interface Props {
    children: React.ReactNode
    className?: string
}

function PageLayout({ children, className }: Props) {
  return (
    <div className={cn("w-full h-full",className)}>{children}</div>
  )
}

export default PageLayout