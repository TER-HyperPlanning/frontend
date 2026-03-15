import { Link, useMatchRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface NavLinkProps {
  to: string
  icon: ReactNode
  label: string
  isOpen: boolean
}

export default function NavLink({ to, icon, label, isOpen }: NavLinkProps) {
  const matchRoute = useMatchRoute()
  const isActive = !!matchRoute({ to, fuzzy: true })

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2.5
        transition-colors duration-200 group relative
        ${isActive
          ? 'bg-primary-500/10 text-primary-600 font-semibold'
          : 'text-gray-500 hover:bg-gray-200/60 hover:text-gray-700'
        }
        ${!isOpen ? 'justify-center' : ''}
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon */}
      <span className="text-xl shrink-0 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>

      {/* Label - animated */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="whitespace-nowrap overflow-hidden text-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {!isOpen && (
        <div className="
          absolute left-full ml-2 px-2 py-1 rounded-md
          bg-gray-800 text-white text-xs
          opacity-0 group-hover:opacity-100
          pointer-events-none transition-opacity duration-200
          whitespace-nowrap z-50
        ">
          {label}
        </div>
      )}
    </Link>
  )
}
