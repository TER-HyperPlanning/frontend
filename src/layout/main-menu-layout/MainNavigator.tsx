import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Users, Settings, Menu, X, UsersRound, BookOpen, GraduationCap, LogOut, Clock, CalendarRange, CalendarCheck, GitBranch } from 'lucide-react'
import Logo from '@/components/Logo'
import NavLink from '../../components/NavLink'
import UserAvatar from '../../components/UserAvatar'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { useAuth, useCurrentUser } from '@/hooks/api/useAuth'
import { navItemsForRole, normalizeRole, type AppRole } from '@/auth/rolePermissions'

const NAV_ICONS: Record<string, ReactNode> = {
  '/planning': <CalendarDays size={20} />,
  '/teachers': <Users size={20} />,
  '/groupes': <UsersRound size={20} />,
  '/buildings': <HiOutlineOfficeBuilding size={20} />,
  '/formations': <BookOpen size={20} />,
  '/filieres': <GitBranch size={20} />,
  '/sessions': <CalendarCheck size={20} />,
  '/requests': <Clock size={20} />,
  '/scolarite': <GraduationCap size={20} />,
  '/availability': <CalendarRange size={20} />,
  '/admin/accounts': <Settings size={20} />,
}

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

  const navItems = useMemo(() => {
    const role = normalizeRole(user?.role) as AppRole | null
    return navItemsForRole(role).map((item) => ({
      ...item,
      icon: NAV_ICONS[item.to] ?? <CalendarDays size={20} />,
    }))
  }, [user?.role])

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
        className="hidden md:flex h-screen flex-col py-4 overflow-hidden shrink-0 sticky top-0"
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

        <div className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
            />
          ))}
        </div>

        <div className="border-none mt-auto px-2 flex flex-col">
          <UserAvatar fullName={fullName} roleLabel={roleLabel} isOpen={isOpen} />
          <button
            type="button"
            onClick={logout}
            className={`
               w-full flex items-center rounded-lg py-2.5
              text-gray-500 hover:bg-gray-200/60 hover:text-gray-700 transition-colors
              ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'}
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

      <nav className="md:hidden flex flex-row items-center justify-around bg-white border-t border-gray-200 p-2 shrink-0 z-50">
        {navItems.map((item) => (
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