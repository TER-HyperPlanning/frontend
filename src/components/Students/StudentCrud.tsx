import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { Download, Plus, Search, Upload } from 'lucide-react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/useToast'
import { useStudentService } from './useStudentService'
import { type CreateStudentRequest, type UpdateStudentRequest, type StudentResponse } from './types'
import AddStudentForm from './AddStudentForm'
import EditStudentForm from './EditStudentForm'
import DeleteStudentButton from './DeleteStudentButton'
import {
  buildStudentEmail,
  buildStudentsCsv,
  buildStudentsCsvTemplate,
  isValidFrenchPhone,
  normalizeFrenchPhone,
  parseStudentsCsv,
} from './studentUtils'

const STUDENTS_PER_PAGE = 10

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
  const [currentPage, setCurrentPage] = useState(1)
  const [importing, setImporting] = useState(false)
  const csvInputRef = useRef<HTMLInputElement | null>(null)

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

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE)),
    [filteredStudents.length],
  )

  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * STUDENTS_PER_PAGE
    const end = start + STUDENTS_PER_PAGE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      showToast('Aucun étudiant à exporter', 'error')
      return
    }

    const csvContent = buildStudentsCsv(filteredStudents)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', 'etudiants.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadTemplate = () => {
    const template = buildStudentsCsvTemplate()
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', 'modele-etudiants.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!defaultGroupId) {
      showToast('Aucun groupe disponible pour importer des étudiants', 'error')
      return
    }

    setImporting(true)
    try {
      const text = await file.text()
      const rows = parseStudentsCsv(text)

      if (rows.length === 0) {
        showToast('Le fichier CSV ne contient aucune ligne', 'error')
        return
      }

      const createdStudents: StudentResponse[] = []
      let skipped = 0

      for (const row of rows) {
        const firstName = row.firstName.trim()
        const lastName = row.lastName.trim()
        const email = (row.email || buildStudentEmail(firstName, lastName)).trim()

        if (!firstName || !lastName || !email) {
          skipped += 1
          continue
        }

        if (row.phone && !isValidFrenchPhone(row.phone)) {
          skipped += 1
          continue
        }

        try {
          const created = await createStudent({
            firstName,
            lastName,
            email,
            password: email,
            phone: row.phone ? normalizeFrenchPhone(row.phone) : null,
            groupId: defaultGroupId,
          })
          createdStudents.push(created)
        } catch {
          skipped += 1
        }
      }

      if (createdStudents.length > 0) {
        setStudents((prev) => [...createdStudents, ...prev])
      }

      showToast(`Import terminé: ${createdStudents.length} ajouté(s), ${skipped} ignoré(s)`, 'success')
    } catch (error) {
      showToast(toErrorMessage(error), 'error')
    } finally {
      setImporting(false)
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="input input-bordered flex items-center gap-2 md:max-w-md w-full">
              <Search size={16} className="text-base-content/40" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="grow text-sm"
              />
            </label>

            <div className="flex items-center gap-2">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                className="hidden"
                onChange={(event) => {
                  void handleCsvImport(event)
                }}
              />

              <Button
                type="button"
                variant="outlined"
                leftIcon={<Upload size={16} />}
                onClick={() => csvInputRef.current?.click()}
                disabled={importing || !defaultGroupId}
              >
                {importing ? 'Import...' : 'Importer CSV'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                leftIcon={<Download size={16} />}
                onClick={handleDownloadTemplate}
              >
                Modèle CSV
              </Button>

              <Button
                type="button"
                variant="outlined"
                leftIcon={<Download size={16} />}
                onClick={handleExportCsv}
                disabled={filteredStudents.length === 0}
              >
                Exporter CSV
              </Button>
            </div>
          </div>
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
                  pagedStudents.map((student) => (
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

          {!loading && filteredStudents.length > 0 && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pt-2">
              <p className="text-sm text-base-content/70">
                Affichage de {(currentPage - 1) * STUDENTS_PER_PAGE + 1} à{' '}
                {Math.min(currentPage * STUDENTS_PER_PAGE, filteredStudents.length)} sur{' '}
                {filteredStudents.length} étudiant(s)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-base-content/70 min-w-20 text-center">
                  Page {currentPage}/{totalPages}
                </span>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
