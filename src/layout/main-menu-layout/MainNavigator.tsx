import Logo from '@/components/Logo'
import { useAuth, useCurrentUser } from '@/hooks/api/useAuth'
import { motion } from 'framer-motion'
import { BookOpen, CalendarDays, Clock, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, UserCheck, Users, UsersRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import NavLink from '../../components/NavLink'
import UserAvatar from '../../components/UserAvatar'

const NAV_ITEMS = [
  { to: '/planning', icon: <CalendarDays size={20} />, label: 'Planning' },
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
  { to: '/teachers', icon: <Users size={20} />, label: 'Enseignants' },
  { to: '/groupes', icon: <UsersRound size={20} />, label: 'Groupes' },
  { to: '/buildings', icon: <HiOutlineOfficeBuilding size={20} />, label: 'Bâtiments et salles' },
  { to: '/formations', icon: <BookOpen size={20} />, label: 'Formations' },
  { to: '/modules', icon: <BookOpen size={20} />, label: 'Modules' }, // icône corrigée
  { to: '/requests', icon: <Clock size={20} />, label: 'Demandes' }, 
  { to: '/scolarite', icon: <GraduationCap size={20} />, label: 'Scolarité' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  { to: '/availability', icon: <UserCheck size={20} />, label: 'Disponibilités' },
]

function toRoleLabel(role: string | null | undefined) {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur'
    case 'TEACHER':
      return 'Enseignant'
    case 'STUDENT':
      return 'Étudiant'
    default:
      return ''
  }
}

export default function MainNavigator() {
  const [isOpen, setIsOpen] = useState(true)
  const { data: user } = useCurrentUser()
  const { logout } = useAuth()

  const fullName = useMemo(() => {
    const first = user?.firstName?.trim() ?? ''
    const last = user?.lastName?.trim() ?? ''
    const combined = `${first} ${last}`.trim()
    return combined || user?.email?.trim() || 'Utilisateur'
  }, [user?.email, user?.firstName, user?.lastName])

  const roleLabel = useMemo(() => toRoleLabel(user?.role), [user?.role])

  return (
    <>
      <motion.nav
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden md:flex h-full flex-col py-4 overflow-hidden shrink-0"
      >
        <div className={`flex items-center mb-6 px-4 ${isOpen ? 'justify-between' : 'justify-center  gap-4 flex-col-reverse'}`}>
          
          
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
        <div className="border-none mt-2 pt-2 px-3">
          <UserAvatar fullName={fullName} roleLabel={roleLabel} isOpen={isOpen} />
          <button
            type="button"
            onClick={logout}
            className={`
              mt-2 w-full flex items-center gap-3 rounded-lg px-3 py-2.5
              text-gray-500 hover:bg-gray-200/60 hover:text-gray-700 transition-colors
              ${!isOpen ? 'justify-center' : ''}
            `}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <span className="text-xl shrink-0 w-5 h-5 flex items-center justify-center">
              <LogOut size={18} />
            </span>
            {isOpen ? <span className="text-sm">Se déconnecter</span> : null}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex flex-row items-center justify-around bg-white border-t border-gray-200 p-2 shrink-0 z-50">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isOpen={false}
          />
        ))}
      </nav>
    </>
  )
}