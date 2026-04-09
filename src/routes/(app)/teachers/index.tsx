import { useState, useEffect } from 'react'
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
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await fetch('https://hyper-planning.fr/api/Teachers', {
        headers: { accept: 'application/json' },
      })
      const data = await res.json()
      const formatted: Teacher[] = data.result.map((t: any) => ({
        id: t.id,
        nom: t.lastName,
        prenom: t.firstName,
        email: t.email,
        telephone: t.phone,
        matricule: t.matricule || '',
        statut: t.title,
        createdAt: t.createdAt,
      }))
      const sorted = formatted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })

      setTeachers(sorted)
    } catch (err) {
      console.error('Erreur fetch Teachers:', err)
    }
  }
  const statutMapping: Record<string, string> = {
  Associé: "ASSOCIE",
  Vacataire: "VACATAIRE",
  Permanent: "PERMANENT",
}

 const fetchFilteredTeachers = async (title: string) => {
  try {
       if (!title) {
      fetchTeachers()
      return
    }

    const query = `?title=${statutMapping[title]}`

    const res = await fetch(`https://hyper-planning.fr/api/Teachers/filter${query}`, {
      headers: { accept: 'application/json' },
    })

    const data = await res.json()

    console.log("DATA API:", data)

    const formatted: Teacher[] = data.result.map((t: any) => ({
      id: t.id,
      nom: t.lastName,
      prenom: t.firstName,
      email: t.email,
      telephone: t.phone,
      matricule: t.matricule || '',
      statut: t.title,
    }))

    setTeachers(formatted)

  } catch (err) {
    console.error('Erreur fetch Teachers:', err)
  }
}

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

   const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher)
    setIsDeleteModalOpen(true)
  }
  const fetchSearchTeachers = async (query: string) => {
  try {
    
    if (!query) {
      fetchTeachers()
      return
    }

    const res = await fetch(
      `https://hyper-planning.fr/api/Teachers/search?query=${query}`,
      { headers: { accept: 'application/json' } }
    )

    const data = await res.json()

    const formatted: Teacher[] = data.result.map((t: any) => ({
      id: t.id,
      nom: t.lastName,
      prenom: t.firstName,
      email: t.email,
      telephone: t.phone,
      matricule: t.matricule || '',
      statut: t.title,
    }))

    setTeachers(formatted)

  } catch (err) {
    console.error("Erreur search:", err)
  }
}

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
      onSuccess={showSuccess}
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
        onSuccess={showSuccess}
        onDelete={(deletedTeacherId) => {
          setTeachers(prev => prev.filter(t => t.id !== deletedTeacherId))
          setIsDeleteModalOpen(false)
        }}
      />
      <div className="flex flex-col gap-6 p-6">
         <TeachersFilters
          searchTerm={searchTerm}
          setSearchTerm={(value) => {
            setSearchTerm(value)
            fetchSearchTeachers(value) 
          }}
          filterStatut={filterStatut}
          setFilterStatut={setFilterStatut}
          showStatutMenu={showStatutMenu}
          setShowStatutMenu={setShowStatutMenu}
          onFilterChange={fetchFilteredTeachers}         />

        <AddTeacherButton onClick={() => setIsModalOpen(true)} />

        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <TeachersTable
              teachers={teachers}
              onEditClick={(teacher) => { setEditingTeacher(teacher); setIsEditModalOpen(true) }}
              onDeleteClick={handleDeleteClick}
            />
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