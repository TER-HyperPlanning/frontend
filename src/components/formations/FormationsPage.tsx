import FormationsHeader from '@/components/formations/FormationsHeader'
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
      <FormationsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={openAddModal}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <FormationsTable
              formations={formations}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </div>
        </div>
      </div>

      <AddFormationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={(values) => {
          addFormation(values)
          showToast('Formation ajoutée avec succès', 'success')
        }}
      />

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

      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}
