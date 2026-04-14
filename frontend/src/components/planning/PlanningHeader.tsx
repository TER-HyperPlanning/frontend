import Logo from '@/components/Logo'
import Select from '@/components/ui/Select'
import { getAccessToken } from '@/auth/storage'
import { useAuth, useCurrentUser } from '@/hooks/api/useAuth'
import PageHeader from '@/layout/page-header/PageHeader'
import { BellIcon, LogOut } from 'lucide-react'

function PlanningHeader() {
  const { logout } = useAuth()
  const { data: user } = useCurrentUser()
  const isAuthed = !!getAccessToken()

  return (
    <PageHeader>
      <Logo showText={true} className="h-10 w-auto text-primary-700" />

      <div className="flex flex-wrap items-center justify-end md:justify-start gap-2 ml-2 md:ml-4 flex-1">
        <Select
          items={[
            { id: 'weekly', value: 'Groupe' },
            { id: 'daily', value: 'Module' },
          ]}
          defaultValue="weekly"
          placeholder="Mode"
          className="select-sm rounded-full max-w-[150px]"
        />
        <Select
          items={[
            { id: 1, value: 'Informatique' },
            { id: 2, value: 'Mathématiques' },
          ]}
          placeholder="Filiere"
          className="select-sm rounded-full max-w-[150px]"
        />
        <Select
          items={[
            { id: 1, value: 'L1' },
            { id: 2, value: 'L2' },
            { id: 3, value: 'L3' },
          ]}
          placeholder="Formation"
          className="select-sm rounded-full max-w-[150px]"
        />
      </div>

      <button className="btn btn-ghost btn-circle btn-sm">
        <BellIcon className="w-5 h-5 text-gray-600" />
      </button>

      {isAuthed ? (
        <button
          type="button"
          onClick={logout}
          className="btn btn-ghost btn-sm rounded-full"
          aria-label="Se déconnecter"
          title={user?.email ?? 'Se déconnecter'}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Se déconnecter</span>
        </button>
      ) : null}
    </PageHeader>
  )
}

export default PlanningHeader
