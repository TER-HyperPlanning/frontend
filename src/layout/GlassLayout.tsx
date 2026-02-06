import { cn } from "@/utils/cn"

interface Props {
    children: React.ReactNode
    className?: string
}

function GlassLayout({ children, className }: Props) {
  return (
    <div className={cn("w-full h-full bg-white/20 backdrop-blur-md",className)}>{children}</div>
  )
}

export default GlassLayout