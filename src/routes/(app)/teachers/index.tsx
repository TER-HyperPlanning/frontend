import { useState} from 'react'
import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/layout/PageLayout'

import TeachersFilters from '@/components/teachers/TeachersFilters'
import TeachersTable from '@/components/teachers/TeachersTable'
import AddTeacherButton from '@/components/teachers/AddTeacherButton'
import AddTeacherModal from "@/components/teachers/AddTeacherModal"
import EditTeacherModal from '@/components/teachers/EditTeacherModal'
import DeleteTeacherModal from '@/components/teachers/DeleteTeacherModal'
import { HiCheckCircle } from "react-icons/hi"
import type { Teacher } from '@/components/teachers/types'


export const Route = createFileRoute('/(app)/teachers/')({
  component: TeachersPage,
})


function TeachersPage() {

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [showStatutMenu, setShowStatutMenu] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher); 
    setIsDeleteModalOpen(true);
  };
  

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
   };


  const [teachers, setTeachers] = useState<Teacher[]>([
  { id: 1, nom: 'Lefebvre', prenom: 'Sophie', email: 'Sophie.lefebvre@univ-evry.fr', telephone: '0601020304', statut: 'Permanent' },
  { id: 2, nom: 'David', prenom: 'Nathalie', email: 'Nathalie.david@univ-evry.fr', telephone: '0605060708', statut: 'Vacataire' },
  { id: 3, nom: 'Klaudel', prenom: 'Hanna', email: 'Hanna.Klaudel@univ-evry.fr', telephone: '0608091011', statut: 'Associé' },
])

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatut = filterStatut ? t.statut === filterStatut : true

    return matchSearch && matchStatut
  })

  return (
    <PageLayout>
        {successMessage && (
            <div className="toast toast-top toast-end z-[100] mt-4 mr-4">
                <div className="alert alert-success shadow-lg text-white border-none bg-emerald-500 flex items-center gap-2">
                <HiCheckCircle size={22} />
                <span className="font-medium">{successMessage}</span>
                </div>
            </div>
        )}
        <EditTeacherModal
            isOpen={isEditModalOpen}
            teacher={editingTeacher}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={(msg) => showSuccess(msg)}
            onEdit={(updatedTeacher) => {
                setTeachers((prev) =>
                    prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
                );
                setIsEditModalOpen(false);
            }}
        />
        <DeleteTeacherModal
          isOpen={isDeleteModalOpen}
          teacher={teacherToDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={(msg) => showSuccess(msg)}
          onDelete={(deletedTeacherId : number) => {
             setTeachers(prev => prev.filter(t => t.id !== deletedTeacherId));
            setIsDeleteModalOpen(false);
          }}
        />

      <div className="flex flex-col gap-6 p-6">

        <TeachersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatut={filterStatut}
          setFilterStatut={setFilterStatut}
          showStatutMenu={showStatutMenu}
          setShowStatutMenu={setShowStatutMenu}
        />

        <AddTeacherButton onClick={() => setIsModalOpen(true)} />

        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <TeachersTable teachers={filteredTeachers}  onEditClick={(teacher) => {setEditingTeacher(teacher); setIsEditModalOpen(true)}} onDeleteClick={handleDeleteClick} />
          </div>
        </div>

        <AddTeacherModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={showSuccess}
            onAdd={(teacher) => setTeachers(prev => [...prev, teacher])}
        />
      </div>

    </PageLayout>
  )
}
