import { Clock, CheckCircle, XCircle } from 'lucide-react'
import StatsCard from './StatsCard'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType = 'Changement de salle' | 'Proposition de récupération de séance'

interface PageHeaderProps {
  pendingCount: number
  approvedCount: number
  refusedCount: number
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  filterStatus: RequestStatus | ''
  setFilterStatus: React.Dispatch<React.SetStateAction<RequestStatus | ''>>
  filterType: RequestType | ''
  setFilterType: React.Dispatch<React.SetStateAction<RequestType | ''>>
}

export default function Header({
  pendingCount,
  approvedCount,
  refusedCount,
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Titre et description */}

      <div className="mb-7"> 
        <h1 className="text-4xl font-bold text-[#003A68]">Gestion des demandes</h1> 
        <p className="text-gray-500 mt-2">Consultez et gérez les demandes des enseignants.</p> 
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-5 overflow-hidden">

        <StatsCard
          label="En attente"
          value={pendingCount}
          valueColor="text-yellow-500"
          iconColor="text-yellow-400"
          icon={<Clock className="w-10 h-10" />}
        />
        <StatsCard
          label="Approuvées"
          value={approvedCount}
          valueColor="text-green-500"
          iconColor="text-green-400"
          icon={<CheckCircle className="w-10 h-10" />}
        />
        <StatsCard
          label="Refusées"
          value={refusedCount}
          valueColor="text-red-500"
          iconColor="text-red-400"
          icon={<XCircle className="w-10 h-10" />}
        />
      </div>

      {/* Barre de recherche + filtres */}
      <div className="bg-[#F4F6F8] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher un professeur, matière, formation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as RequestType | '')}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
        >
          <option value="">Tous les types</option>
          <option value="Changement de salle">Changement de salle</option>
          <option value="Récupération de séance">Proposition de récupération de séance</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as RequestStatus | '')}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Approuvé">Approuvé</option>
          <option value="Refusé">Refusé</option>
        </select>
      </div>
    </div>
  )
}