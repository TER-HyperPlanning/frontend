import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import Logo from '@/components/Logo'
import Toast from '@/components/Toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { Plus, Search } from 'lucide-react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/useToast'
import { useStudentService } from './useStudentService'
import { type CreateStudentRequest, type UpdateStudentRequest, type StudentResponse } from './types'
import AddStudentForm from './AddStudentForm'
import EditStudentForm from './EditStudentForm'
import DeleteStudentButton from './DeleteStudentButton'

function toErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } }
      message?: string
    }

    if (maybeAxiosError.response?.data?.message) {
      return maybeAxiosError.response.data.message
    }

    if (maybeAxiosError.message) {
      return maybeAxiosError.message
    }
  }

  return 'Une erreur est survenue'
}

export default function StudentCrud() {
  const { getStudents, getGroups, createStudent, updateStudent, deleteStudent } =
    useStudentService()
  const { toast, showToast, hideToast } = useToast()

  const [students, setStudents] = useState<StudentResponse[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [defaultGroupId, setDefaultGroupId] = useState<string | undefined>(undefined)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [studentsData, groupsData] = await Promise.all([getStudents(), getGroups()])
      setStudents(studentsData)
      setDefaultGroupId(groupsData[0]?.id)
    } catch (error) {
      showToast(toErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }, [getStudents, getGroups, showToast])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students

    return students.filter((student) => {
      return `${student.firstName} ${student.lastName} ${student.email}`.toLowerCase().includes(q)
    })
  }, [students, search])

  const handleEdit = (student: StudentResponse) => {
    setEditingId(student.id)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id)
      setStudents((prev) => prev.filter((student) => student.id !== id))
      showToast('Etudiant supprimé avec succès', 'success')
      if (editingId === id) setEditingId(null)
    } catch (error) {
      showToast(toErrorMessage(error), 'error')
    }
  }

  const handleCreate = async (payload: CreateStudentRequest) => {
    setCreating(true)
    try {
      const createdStudent = await createStudent(payload)
      setStudents((prev) => [createdStudent, ...prev])
      showToast('Etudiant créé avec succès', 'success')
      setIsAddModalOpen(false)
    } catch (error) {
      showToast(toErrorMessage(error), 'error')
      throw error
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (id: string, payload: UpdateStudentRequest) => {
    setUpdating(true)
    try {
      const updatedStudent = await updateStudent(id, payload)
      setStudents((prev) => prev.map((student) => (student.id === id ? updatedStudent : student)))
      setEditingId(null)
      showToast('Etudiant mis à jour avec succès', 'success')
    } catch (error) {
      showToast(toErrorMessage(error), 'error')
    } finally {
      setUpdating(false)
    }
  }

  const editingStudent = useMemo(
    () => students.find((student) => student.id === editingId) ?? null,
    [students, editingId],
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Logo showText={true} className="h-10 text-primary-800 shrink-0" />
        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus size={18} />}
          className="bg-primary-900 hover:bg-primary-800 text-white"
          disabled={!defaultGroupId}
        >
          Nouvel étudiant
        </Button>
      </div>

      <div className="card bg-base-100 border border-base-200 mb-6">
        <div className="card-body py-4 px-5">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow text-sm"
            />
          </label>
        </div>
      </div>

      <AddStudentForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultGroupId={defaultGroupId}
        submitting={creating}
        onCreate={handleCreate}
        onValidationError={(message) => showToast(message, 'error')}
      />

      <EditStudentForm
        student={editingStudent}
        submitting={updating}
        onUpdate={handleUpdate}
        onCancel={() => setEditingId(null)}
        onValidationError={(message) => showToast(message, 'error')}
      />

      <div className="card bg-base-100 border border-base-200">
        <div className="card-body gap-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Prénom</TableHeader>
                  <TableHeader>Nom</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Téléphone</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-base-content/60">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-base-content/60">
                      Aucun étudiant trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(student)}
                            className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                          >
                            <PencilSquareIcon className="size-4" />
                          </button>
                          <DeleteStudentButton
                            studentId={student.id}
                            studentName={`${student.firstName} ${student.lastName}`}
                            onDelete={handleDelete}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
