import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus, Upload } from 'lucide-react'
import Logo from '@/components/Logo'
import FormationsSearchBar from '@/components/formations/FormationsSearchBar'
import FormationsTable from '@/components/formations/FormationsTable'
import AddFormationModal from '@/components/formations/AddFormationModal'
import EditFormationModal from '@/components/formations/EditFormationModal'
import DeleteFormationModal from '@/components/formations/DeleteFormationModal'
import ProgrammeInfoModal from '@/components/formations/ProgrammeInfoModal'
import Toast from '@/components/Toast'
import Button from '@/components/Button'
import { useFormations } from '@/hooks/formations/useFormations'
import { useFiliereOptions } from '@/hooks/formations/useFiliereOptions'
import { useToast } from '@/hooks/useToast'
import { type Formation } from '@/types/formation'

interface FormationsPageProps {
  /** Pré-sélectionne la filière dans le modal d'ajout (venant de la page Filières) */
  defaultFiliereId?: string
  /** Ouvre automatiquement le modal d'édition pour cette formation */
  autoEditId?: string
}

export default function FormationsPage({
  defaultFiliereId,
  autoEditId,
}: FormationsPageProps) {
  const {
    formations,
    isLoading,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    editTarget,
    openEditModal,
    closeEditModal,
    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    addFormation,
    editFormation,
    deleteFormation,
    isImporting,
    importCSV,
    sortOrder,
    setSortOrder,
  } = useFormations()

  const filiereFilterOptions = useFiliereOptions()
  const { toast, showToast, hideToast } = useToast()
  const navigate = useNavigate()
  const [programmeTarget, setProgrammeTarget] = useState<Formation | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const count = await importCSV(file)
      showToast(`${count} formation(s) importée(s) avec succès`, 'success')
    } catch (e: any) {
      const backendMsg = e?.response?.data?.message || e?.response?.data || e?.message || 'Erreur inconnue'
      showToast(`Erreur d'import : ${backendMsg}`, 'error')
    } finally {
      // Reset input so the same file can be uploaded again if needed
      event.target.value = ''
    }
  }

  // Auto-ouvrir le modal d'ajout si on arrive avec un filiereId dans l'URL
  useEffect(() => {
    if (defaultFiliereId) {
      openAddModal()
    }
  }, [defaultFiliereId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-ouvrir le modal d'édition si on arrive avec un editId dans l'URL
  useEffect(() => {
    if (autoEditId && !isLoading && formations.length > 0) {
      const target = formations.find((f) => f.id === autoEditId)
      if (target) {
        openEditModal(target)
      }
    }
  }, [autoEditId, isLoading, formations.length]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Nettoie les search params de l'URL après fermeture d'un modal */
  function clearSearchParams() {
    if (defaultFiliereId || autoEditId) {
      navigate({ to: '/formations', search: {}, replace: true })
    }
  }

  function handleCloseAddModal() {
    closeAddModal()
    clearSearchParams()
  }

  function handleCloseEditModal() {
    closeEditModal()
    clearSearchParams()
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
            onClick={openAddModal}
            disabled={isImporting}
            leftIcon={<Plus size={18} />}
            className="bg-primary-900 hover:bg-primary-800 text-white"
          >
            Nouvelle Formation
          </Button>
        </div>
      </div>

      <FormationsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filiereFilter={filiereFilter}
        onFiliereChange={setFiliereFilter}
        filieres={filiereFilterOptions}
      />

      <div className="card bg-base-100 border border-base-200">
        <div className="overflow-x-auto">
          <FormationsTable
            formations={formations}
            isLoading={isLoading}
            sortOrder={sortOrder}
            onSortToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onViewProgramme={(f) => setProgrammeTarget(f)}
            onViewGroups={(f) =>
              navigate({ to: '/formations/$formationId/groupes', params: { formationId: f.id } })
            }
            onViewModules={(f) =>
              navigate({ to: '/formations/$formationId/modules', params: { formationId: f.id } })
            }
          />
        </div>
      </div>

      <AddFormationModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        defaultFiliereId={defaultFiliereId}
        onAdd={async (values) => {
          try {
            await addFormation(values)
            showToast('Formation créée avec succès', 'success')
            clearSearchParams()
          } catch {
            showToast('Erreur lors de la création de la formation', 'error')
          }
        }}
      />

      <EditFormationModal
        isOpen={!!editTarget}
        formation={editTarget}
        onClose={handleCloseEditModal}
        onEdit={async (values) => {
          if (!editTarget) return
          try {
            await editFormation(editTarget.id, values)
            showToast('Formation modifiée avec succès', 'success')
            clearSearchParams()
          } catch {
            showToast('Erreur lors de la modification de la formation', 'error')
          }
        }}
      />

      <DeleteFormationModal
        isOpen={!!deleteTarget}
        formation={deleteTarget}
        onClose={closeDeleteModal}
        onConfirm={async () => {
          if (!deleteTarget) return
          try {
            await deleteFormation(deleteTarget.id)
            showToast('Formation supprimée avec succès', 'success')
          } catch {
            showToast('Erreur lors de la suppression de la formation', 'error')
          }
        }}
      />

      <ProgrammeInfoModal
        isOpen={!!programmeTarget}
        formation={programmeTarget}
        onClose={() => setProgrammeTarget(null)}
      />

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
