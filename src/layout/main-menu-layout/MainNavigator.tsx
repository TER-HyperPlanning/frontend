import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, LayoutDashboard, Users, Settings, Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'
import NavLink from '../../components/NavLink'
import UserAvatar from '../../components/UserAvatar'

const NAV_ITEMS = [
  { to: '/planning', icon: <CalendarDays size={20} />, label: 'Planning' },
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
  { to: '/teachers', icon: <Users size={20} />, label: 'Enseignants' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
]

export default function MainNavigator() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.nav
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full flex flex-col py-4 overflow-hidden shrink-0"
    >
      <div className={`flex items-center mb-6 px-4 ${isOpen ? 'justify-between' : 'justify-center flex-col gap-4 flex-col-reverse'}`}>
        
        
        <Logo showText={false} className="h-8 w-auto text-primary-700" />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/60 hover:text-gray-700 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>
        
      </div>

      {/* Navigation links */}
      <div className="flex-1 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isOpen={isOpen}
          />
        ))}
      </div>

      {/* Bottom: User avatar */}
      <div className="border-none mt-2 pt-2">
        <UserAvatar fullName="John Doe" isOpen={isOpen} />
      </div>
    </motion.nav>
  )
}