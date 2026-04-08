import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
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
import { useTrackOptions } from '@/hooks/formations/useTrackOptions'
import { useToast } from '@/hooks/useToast'
import { type Formation } from '@/types/formation'

export default function FormationsPage() {
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
  } = useFormations()

  const trackOptions = useTrackOptions()
  const { toast, showToast, hideToast } = useToast()
  const navigate = useNavigate()
  const [programmeTarget, setProgrammeTarget] = useState<Formation | null>(null)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Logo showText={true} className="h-10 text-primary-800 shrink-0" />
        <div className="flex items-center gap-3">
          <Button
            onClick={openAddModal}
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
        filieres={trackOptions}
      />

      <div className="card bg-base-100 border border-base-200">
        <div className="overflow-x-auto">
          <FormationsTable
            formations={formations}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onViewProgramme={(f) => setProgrammeTarget(f)}
            onViewGroups={(f) =>
              navigate({ to: '/formations/$formationId/groupes', params: { formationId: f.id } })
            }
          />
        </div>
      </div>

      <AddFormationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={async (values) => {
          try {
            await addFormation(values)
            showToast('Formation créée avec succès', 'success')
          } catch {
            showToast('Erreur lors de la création de la formation', 'error')
          }
        }}
      />

      <EditFormationModal
        isOpen={!!editTarget}
        formation={editTarget}
        onClose={closeEditModal}
        onEdit={async (values) => {
          if (!editTarget) return
          try {
            await editFormation(editTarget.id, values)
            showToast('Formation modifiée avec succès', 'success')
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
