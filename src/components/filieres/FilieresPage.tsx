import { Plus } from 'lucide-react'
import Logo from '@/components/Logo'
import FilieresSearchBar from '@/components/filieres/FilieresSearchBar'
import FilieresList from '@/components/filieres/FilieresList'
import AddFiliereModal from '@/components/filieres/AddFiliereModal'
import EditFiliereModal from '@/components/filieres/EditFiliereModal'
import DeleteFiliereModal from '@/components/filieres/DeleteFiliereModal'
import DeleteFormationInFiliereModal from '@/components/filieres/DeleteFormationInFiliereModal'
import Toast from '@/components/Toast'
import Button from '@/components/Button'
import { useFilieres } from '@/hooks/filieres/useFilieres'
import { useToast } from '@/hooks/useToast'

export default function FilieresPage() {
  const {
    filieres,
    isLoading,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    filieresOptions,
    isAddFiliereOpen,
    openAddFiliere,
    closeAddFiliere,
    addFiliere,
    renameTarget,
    openRenameFiliere,
    closeRenameFiliere,
    renameFiliere,
    deleteFiliereTarget,
    openDeleteFiliere,
    closeDeleteFiliere,
    removeFiliere,
    deleteFormationTarget,
    openDeleteFormation,
    closeDeleteFormation,
    removeFormation,
  } = useFilieres()

  const { toast, showToast, hideToast } = useToast()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Logo showText={true} className="h-10 text-primary-800 shrink-0" />
        <div className="flex items-center gap-3">
          <Button
            onClick={openAddFiliere}
            leftIcon={<Plus size={18} />}
            className="bg-primary-900 hover:bg-primary-800 text-white"
          >
            Nouvelle filière
          </Button>
        </div>
      </div>

      <FilieresSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filiereFilter={filiereFilter}
        onFiliereChange={setFiliereFilter}
        filieresOptions={filieresOptions}
      />

      <div className="card bg-base-100 border border-base-200">
        <FilieresList
          filieres={filieres}
          isLoading={isLoading}
          onRenameFiliere={openRenameFiliere}
          onDeleteFiliere={openDeleteFiliere}
          onDeleteFormation={openDeleteFormation}
        />
      </div>

      <AddFiliereModal
        isOpen={isAddFiliereOpen}
        onClose={closeAddFiliere}
        onAdd={async (values) => {
          try {
            await addFiliere(values)
            showToast('Filière créée avec succès', 'success')
          } catch (e) {
            showToast(
              e instanceof Error ? e.message : 'Erreur lors de la création de la filière',
              'error',
            )
          }
        }}
      />

      <EditFiliereModal
        isOpen={!!renameTarget}
        filiere={renameTarget}
        onClose={closeRenameFiliere}
        onSave={async (values) => {
          if (!renameTarget) return
          try {
            await renameFiliere(renameTarget.id, values)
            showToast('Filière renommée', 'success')
          } catch {
            showToast('Erreur lors du renommage', 'error')
          }
        }}
      />

      <DeleteFiliereModal
        isOpen={!!deleteFiliereTarget}
        filiere={deleteFiliereTarget}
        onClose={closeDeleteFiliere}
        onConfirm={async () => {
          if (!deleteFiliereTarget) return
          try {
            await removeFiliere(deleteFiliereTarget.id)
            showToast('Filière supprimée', 'success')
          } catch (e) {
            showToast(
              e instanceof Error ? e.message : 'Erreur lors de la suppression',
              'error',
            )
          }
        }}
      />

      <DeleteFormationInFiliereModal
        isOpen={!!deleteFormationTarget}
        formation={deleteFormationTarget}
        onClose={closeDeleteFormation}
        onConfirm={async () => {
          if (!deleteFormationTarget) return
          try {
            await removeFormation(deleteFormationTarget.id)
            showToast('Formation supprimée', 'success')
          } catch {
            showToast('Erreur lors de la suppression', 'error')
          }
        }}
      />

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
