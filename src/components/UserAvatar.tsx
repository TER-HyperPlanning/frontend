import { AnimatePresence, motion } from 'framer-motion'

interface UserAvatarProps {
  fullName: string
  isOpen: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserAvatar({ fullName, isOpen }: UserAvatarProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-3
        ${!isOpen ? 'justify-center' : ''}
      `}
    >
      {/* Avatar circle */}
      <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {getInitials(fullName)}
      </div>

      {/* Name - animated */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm font-medium text-gray-700 leading-tight">
              {fullName}
            </p>
            <p className="text-xs text-gray-400 leading-tight">Enseignant</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
