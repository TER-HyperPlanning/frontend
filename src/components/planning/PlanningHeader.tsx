import Logo from '@/components/Logo'
import Select from '@/components/ui/Select'
import PageHeader from '@/layout/page-header/PageHeader'
import { BellIcon } from 'lucide-react'

function PlanningHeader() {
  return (
    <PageHeader>
      <Logo showText={true} className="h-10 w-auto text-primary-700" />

      <div className="flex items-center gap-2 ml-4 flex-1">
        <Select
          items={[
            { id: 'weekly', value: 'Semaine' },
            { id: 'daily', value: 'Jour' },
            { id: 'monthly', value: 'Mois' },
          ]}
          defaultValue="weekly"
          placeholder="Mode"
          className="select-sm rounded-full min-w-[120px]"
        />
        <Select
          items={[
            { id: 1, value: 'Informatique' },
            { id: 2, value: 'Mathématiques' },
          ]}
          placeholder="Filiere"
          className="select-sm rounded-full min-w-[120px]"
        />
        <Select
          items={[
            { id: 1, value: 'L1' },
            { id: 2, value: 'L2' },
            { id: 3, value: 'L3' },
          ]}
          placeholder="Formation"
          className="select-sm rounded-full min-w-[140px]"
        />
      </div>

      <button className="btn btn-ghost btn-circle btn-sm">
        <BellIcon className="w-5 h-5 text-gray-600" />
      </button>
    </PageHeader>
  )
}

export default PlanningHeader
