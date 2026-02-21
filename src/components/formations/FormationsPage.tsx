import FormationsHeader from '@/components/formations/FormationsHeader'
import FormationsSearchBar from '@/components/formations/FormationsSearchBar'
import FormationsTable from '@/components/formations/FormationsTable'
import AddFormationModal from '@/components/formations/AddFormationModal'
import EditFormationModal from '@/components/formations/EditFormationModal'
import DeleteFormationModal from '@/components/formations/DeleteFormationModal'
import Toast from '@/components/Toast'
import { useFormations } from '@/hooks/formations/useFormations'
import { useToast } from '@/hooks/useToast'

export default function FormationsPage() {
  const {
    formations,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    niveauFilter,
    setNiveauFilter,
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

  const { toast, showToast, hideToast } = useToast()

  return (
    <div className="flex flex-col h-full">
      <FormationsHeader onAddClick={openAddModal} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <FormationsSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filiereFilter={filiereFilter}
          onFiliereChange={setFiliereFilter}
          niveauFilter={niveauFilter}
          onNiveauChange={setNiveauFilter}
        />

        <FormationsTable
          formations={formations}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </div>

      {/* Add formation modal */}
      <AddFormationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={(values) => {
          addFormation(values)
          showToast('Formation ajoutée avec succès', 'success')
        }}
      />

      {/* Edit formation modal */}
      <EditFormationModal
        isOpen={!!editTarget}
        formation={editTarget}
        onClose={closeEditModal}
        onEdit={(values) => {
          if (editTarget) {
            editFormation(editTarget.id, values)
            showToast('Formation modifiée avec succès', 'success')
          }
        }}
      />

      {/* Delete confirmation modal */}
      <DeleteFormationModal
        isOpen={!!deleteTarget}
        formation={deleteTarget}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (deleteTarget) {
            deleteFormation(deleteTarget.id)
            showToast('Formation supprimée avec succès', 'success')
          }
        }}
      />

      {/* Toast notifications */}
      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}
