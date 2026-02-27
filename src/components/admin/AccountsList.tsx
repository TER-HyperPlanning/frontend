import { useEffect, useState } from 'react'
import { fetchAccounts, deleteAccount, disableAccount, enableAccount } from '@/utils/api'
import type { Account } from '@/types'
import AccountRow from './AccountRow'
import TextField from '@/components/TextField'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { useToast } from '@/utils/useToast'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function AccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const { toasts, removeToast, success, error } = useToast()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const list = await fetchAccounts()
      setAccounts(list)
    } catch (err) {
      error('Erreur lors du chargement des comptes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter((account) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      account.name.toLowerCase().includes(query) || account.email.toLowerCase().includes(query)

    let matchesStatus = true
    if (statusFilter === 'active') matchesStatus = account.active
    if (statusFilter === 'inactive') matchesStatus = !account.active

    return matchesSearch && matchesStatus
  })

  async function handleToggleActive(id: string, nextActive: boolean) {
    try {
      if (nextActive) await enableAccount(id)
      else await disableAccount(id)

      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, active: nextActive } : a)))
      success(nextActive ? 'Compte activé avec succès' : 'Compte désactivé avec succès')
    } catch (err) {
      error('Erreur lors de la modification du statut')
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAccount(id)
      setAccounts((prev) => prev.filter((a) => a.id !== id))
      success('Compte supprimé avec succès')
    } catch (err) {
      error('Erreur lors de la suppression du compte')
      console.error(err)
    }
  }

  if (loading) return <div className="p-6 text-stone-400 text-center">Chargement des comptes...</div>

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast id={toast.id} message={toast.message} type={toast.type} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-primary-500/20 shadow-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Gestion des Comptes Scolarité
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            {filteredAccounts.length} compte{filteredAccounts.length !== 1 ? 's' : ''} trouvé{filteredAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            <TextField
              name="search"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-stone-800/50 border-stone-700 placeholder:text-stone-500"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 text-sm sm:text-base transition-all ${
              statusFilter === 'all' ? 'bg-primary-600 hover:bg-primary-700' : 'border-primary-500/30 hover:border-primary-500/50'
            }`}
          >
            Tous les comptes
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 text-sm sm:text-base transition-all ${
              statusFilter === 'active' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-500/30 hover:border-emerald-500/50'
            }`}
          >
            Actifs
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 text-sm sm:text-base transition-all ${
              statusFilter === 'inactive' ? 'bg-stone-600 hover:bg-stone-700' : 'border-stone-500/30 hover:border-stone-500/50'
            }`}
          >
            Désactivés
          </Button>
        </div>

        {/* Accounts List */}
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <FunnelIcon className="w-12 h-12 mx-auto text-stone-500 mb-4 opacity-50" />
            <p className="text-stone-400">
              {accounts.length === 0 ? 'Aucun compte trouvé.' : 'Aucun résultat ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="bg-stone-800/30 rounded-xl overflow-hidden border border-stone-700/50">
            <div className="divide-y divide-stone-700/50">
              {filteredAccounts.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
