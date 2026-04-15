import { Plus, UsersRound } from 'lucide-react'
import Logo from '@/components/Logo'
import SessionsSearchBar from '@/components/sessions/SessionsSearchBar'
import SessionsTable from '@/components/sessions/SessionsTable'
import AddSessionModal from '@/components/sessions/AddSessionModal'
import EditSessionModal from '@/components/sessions/EditSessionModal'
import DeleteSessionModal from '@/components/sessions/DeleteSessionModal'
import Toast from '@/components/Toast'
import Button from '@/components/Button'
import { useSessions } from '@/hooks/sessions/useSessions'
import { useToast } from '@/hooks/useToast'

export default function SessionsPage() {
  const {
    sessions,
    isLoading,
    searchQuery, setSearchQuery,
    typeFilter, setTypeFilter,
    selectedGroupId, setSelectedGroupId,
    groupOptions,
    dateSort, setDateSort,
    isAddModalOpen, openAddModal, closeAddModal,
    editTarget, openEditModal, closeEditModal,
    deleteTarget, openDeleteModal, closeDeleteModal,
    addSession, editSession, deleteSession,
  } = useSessions()

  const { toast, showToast, hideToast } = useToast()

  const hasGroup = Boolean(selectedGroupId)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Logo showText={true} className="h-10 text-primary-800 shrink-0" />
        <div className="flex items-center gap-3">
          <Button
            onClick={openAddModal}
            leftIcon={<Plus size={18} />}
            className="bg-primary-900 hover:bg-primary-800 text-white"
            disabled={!hasGroup}
          >
            Nouvelle Séance
          </Button>
        </div>
      </div>

      <SessionsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        selectedGroupId={selectedGroupId}
        onGroupChange={setSelectedGroupId}
        groupOptions={groupOptions}
        dateSort={dateSort}
        onDateSortChange={setDateSort}
        disabledFilters={!hasGroup}
      />

      {!hasGroup ? (
        <div className="card bg-base-100 border border-base-200 border-dashed">
          <div className="card-body items-center text-center py-16 px-6">
            <UsersRound className="size-14 text-base-content/25 mb-4" aria-hidden />
            <h2 className="text-lg font-semibold text-base-content">
              Choisissez un groupe
            </h2>
            <p className="text-sm text-base-content/60 mt-2 max-w-md">
              Les séances sont affichées par groupe. Sélectionnez un groupe dans le champ prévu
              à cet effet pour charger et filtrer les séances associées.
            </p>
            {isLoading ? (
              <p className="text-xs text-base-content/40 mt-4">Chargement des données…</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <SessionsTable
              sessions={sessions}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              emptyMessage="Aucune séance pour ce groupe avec les filtres actuels."
            />
          </div>
        </div>
      )}

      <AddSessionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        defaultGroupId={selectedGroupId}
        onAdd={async (values) => {
          const error = await addSession(values)
          if (error) {
            showToast(error, 'error')
            return false
          }
          showToast('Séance créée avec succès', 'success')
          return true
        }}
      />

      <EditSessionModal
        isOpen={!!editTarget}
        session={editTarget}
        onClose={closeEditModal}
        onEdit={async (values) => {
          if (!editTarget) return false
          const error = await editSession(editTarget.id, values)
          if (error) {
            showToast(error, 'error')
            return false
          }
          showToast('Séance modifiée avec succès', 'success')
          return true
        }}
      />

      <DeleteSessionModal
        isOpen={!!deleteTarget}
        session={deleteTarget}
        onClose={closeDeleteModal}
        onConfirm={async () => {
          if (!deleteTarget) return
          const error = await deleteSession(deleteTarget.id)
          if (error) {
            showToast(error, 'error')
          } else {
            showToast('Séance supprimée avec succès', 'success')
          }
        }}
      />

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
