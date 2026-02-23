import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

// Types pour les données
type GroupType = 'FI' | 'FA'

interface Group {
  id: string
  nom: string
  type: GroupType
  formation: string
  classe: string
  capacite: number
  effectif: number
}

export const Route = createFileRoute('/(app)/groupes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [groupes, setGroupes] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [formationFilter, setFormationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: 'capacite' | 'effectif' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  // Simulation des données d'exemple (à remplacer par l'API GetGroupes)
  const mockData: Group[] = [
    { id: '1', nom: 'Groupe A', type: 'FI', formation: 'Informatique', classe: 'L3', capacite: 30, effectif: 28 },
    { id: '2', nom: 'Groupe B', type: 'FA', formation: 'Informatique', classe: 'M1', capacite: 25, effectif: 23 },
    { id: '3', nom: 'Groupe C', type: 'FI', formation: 'Mathématiques', classe: 'L2', capacite: 35, effectif: 32 },
    { id: '4', nom: 'Groupe D', type: 'FA', formation: 'Physique', classe: 'M2', capacite: 20, effectif: 18 },
    { id: '5', nom: 'Groupe E', type: 'FI', formation: 'Informatique', classe: 'L1', capacite: 40, effectif: 35 },
  ]

  // Chargement des données (à remplacer par l'API GetGroupes)
  useEffect(() => {
    const fetchGroupes = async () => {
      setLoading(true)
      try {
        // TODO: Remplacer par l'appel à l'API GetGroupes
        // const response = await fetch('/api/groupes')
        // const data = await response.json()
        // setGroupes(data)
        
        // Simulation d'un délai d'API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setGroupes(mockData)
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error)
        setGroupes([])
      } finally {
        setLoading(false)
      }
    }

    fetchGroupes()
  }, [])

  // Obtenir les formations uniques pour le filtre
  const formations = useMemo(() => {
    const uniqueFormations = [...new Set(groupes.map(g => g.formation))]
    return uniqueFormations.sort()
  }, [groupes])

  // Filtrage et tri des données
  const filteredAndSortedGroupes = useMemo(() => {
    let filtered = groupes.filter(groupe => {
      const matchesFormation = formationFilter === 'all' || groupe.formation === formationFilter
      const matchesType = typeFilter === 'all' || groupe.type === typeFilter
      const matchesSearch = groupe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          groupe.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          groupe.classe.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFormation && matchesType && matchesSearch
    })

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        if (sortConfig.direction === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      })
    }

    return filtered
  }, [groupes, formationFilter, typeFilter, searchTerm, sortConfig])

  // Gestion du tri
  const handleSort = (key: 'capacite' | 'effectif') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      } else {
        return { key, direction: 'asc' }
      }
    })
  }

  // Composant pour les en-têtes triables
  const SortableHeader = ({ children, sortKey }: { children: React.ReactNode, sortKey: 'capacite' | 'effectif' }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp 
            size={12} 
            className={`${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} 
          />
          <ChevronDown 
            size={12} 
            className={`${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'} -mt-1`} 
          />
        </div>
      </div>
    </th>
  )

  return (
    <div className="size-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des Groupes</h1>
          <p className="mt-1 text-sm text-gray-600">Gérez et organisez les groupes d'étudiants</p>
        </div>

        {/* Filtres et recherche */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher un groupe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtre par formation */}
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les formations</option>
              {formations.map(formation => (
                <option key={formation} value={formation}>{formation}</option>
              ))}
            </select>

            {/* Filtre par type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="FI">Formation Initiale (FI)</option>
              <option value="FA">Formation par Alternance (FA)</option>
            </select>

            {/* Stats */}
            <div className="flex items-center text-sm text-gray-600">
              {filteredAndSortedGroupes.length} groupe{filteredAndSortedGroupes.length > 1 ? 's' : ''} affiché{filteredAndSortedGroupes.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des groupes...</span>
            </div>
          ) : filteredAndSortedGroupes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe trouvé</h3>
              <p className="text-gray-500">
                {groupes.length === 0 
                  ? "Aucun groupe n'a été créé pour le moment." 
                  : "Aucun groupe ne correspond aux critères de recherche."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classe
                    </th>
                    <SortableHeader sortKey="capacite">Capacité</SortableHeader>
                    <SortableHeader sortKey="effectif">Effectif</SortableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedGroupes.map((groupe) => (
                    <tr key={groupe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{groupe.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          groupe.type === 'FI' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {groupe.type === 'FI' ? 'Formation Initiale' : 'Formation Alternance'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {groupe.formation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {groupe.classe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {groupe.capacite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{groupe.effectif}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (groupe.effectif / groupe.capacite) > 0.9 
                                  ? 'bg-red-500' 
                                  : (groupe.effectif / groupe.capacite) > 0.7 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((groupe.effectif / groupe.capacite) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}