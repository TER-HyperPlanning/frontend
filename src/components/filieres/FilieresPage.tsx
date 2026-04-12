import { useRef } from 'react'
import { Plus, Upload } from 'lucide-react'
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
    isImporting,
    importCSV,
  } = useFilieres()

  const { toast, showToast, hideToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const count = await importCSV(file)
      showToast(`${count} filière(s)/formation(s) importée(s) avec succès`, 'success')
    } catch (e: any) {
      const backendMsg = e?.response?.data?.message || e?.response?.data || e?.message || 'Erreur inconnue'
      showToast(`Erreur d'import : ${backendMsg}`, 'error')
    } finally {
      // Reset input so the same file can be uploaded again if needed
      event.target.value = ''
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Logo showText={true} className="h-10 text-primary-800 shrink-0" />
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            leftIcon={isImporting ? <span className="loading loading-spinner w-4 h-4" /> : <Upload size={18} />}
            className="border-primary-900/30 text-primary-900 hover:bg-primary-900/10"
          >
            {isImporting ? 'Importation…' : 'Importer CSV'}
          </Button>
          <Button
            onClick={openAddFiliere}
            disabled={isImporting}
            leftIcon={<Plus size={18} />}
            className="bg-primary-900 hover:bg-primary-800 text-white"
          >
            Nouvelle filière
          </Button>
        </div>
      </div>

      <FilieresSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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
