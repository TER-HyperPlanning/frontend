import { type Account } from '@/types'
import Button from '@/components/Button'
import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AccountRow({
  account,
  onToggleActive,
  onDelete,
}: {
  account: Account
  onToggleActive: (id: string, nextActive: boolean) => void
  onDelete: (id: string) => void
}) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-stone-700/30 transition-colors">
      {/* Account Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {account.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-white truncate">{account.name}</div>
          <div className="text-xs sm:text-sm text-stone-400 truncate">{account.email}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Status Badge */}
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
            account.active
              ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/50'
              : 'bg-stone-800/40 text-stone-300 border border-stone-700/50'
          }`}
        >
          {account.active ? (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              <span>Actif</span>
            </>
          ) : (
            <>
              <XCircleIcon className="w-4 h-4" />
              <span>Désactivé</span>
            </>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant={account.active ? 'outlined' : 'filled'}
          className={`px-3 py-1 text-xs sm:text-sm flex-shrink-0 transition-all ${
            account.active
              ? 'border-red-500/30 text-red-300 hover:border-red-500/50 hover:bg-red-500/5'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
          onClick={async () => {
            setLoading(true)
            await onToggleActive(account.id, !account.active)
            setLoading(false)
          }}
          disabled={loading}
        >
          {loading ? '...' : account.active ? 'Désactiver' : 'Activer'}
        </Button>

        {/* Delete Button */}
        <Button
          variant="filled"
          className="px-3 py-1 text-xs sm:text-sm bg-red-600/80 hover:bg-red-600 text-white flex-shrink-0 transition-all"
          onClick={async () => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer le compte "${account.name}" ?`)) {
              setLoading(true)
              await onDelete(account.id)
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          <span className="hidden sm:inline">Supprimer</span>
          <TrashIcon className="w-4 h-4 sm:hidden" />
        </Button>
      </div>
    </div>
  )
}

