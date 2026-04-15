import { useState } from 'react'
import Button from '@/components/Button'
import { HiOutlineExclamation, HiOutlineTrash } from 'react-icons/hi'
import { TrashIcon } from '@heroicons/react/24/outline'

interface DeleteStudentButtonProps {
  studentId: string
  studentName: string
  onDelete: (id: string) => Promise<void>
}

export default function DeleteStudentButton({
  studentId,
  studentName,
  onDelete,
}: DeleteStudentButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(studentId)
      setIsOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={deleting}
        className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error"
      >
        <TrashIcon className="size-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                <HiOutlineExclamation size={40} />
              </div>

              <h3 className="text-2xl font-bold text-[#003366] mb-2">Supprimer l'étudiant</h3>
              <p className="text-gray-500 mb-8">
                Êtes-vous sûr de vouloir supprimer{' '}
                <span className="font-bold text-gray-700">{studentName}</span> ? Cette action est irréversible.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
                  disabled={deleting}
                >
                  Annuler
                </button>

                <Button
                  onClick={() => void handleDelete()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-200"
                  disabled={deleting}
                >
                  <HiOutlineTrash size={20} />
                  <span>{deleting ? 'Suppression...' : 'Supprimer'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
