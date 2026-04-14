import { CheckCircle, XCircle, Clock } from 'lucide-react'
import type { SessionChange } from '@/types/sessionChange'

interface RequestCardProps {
  data: SessionChange
  onViewDetails?: () => void
}

/* =========================
   STATUS FORMATTER
========================= */
const formatStatus = (status: string) => {
  switch (status) {
    case 'ATTENTE':
      return 'En attente'
    case 'APPROUVE':
      return 'Approuvé'
    case 'REFUSE':
      return 'Refusé'
    default:
      return status
  }
}

export default function RequestCard({
  data,
  onViewDetails
}: RequestCardProps) {

  if (!data) return null

  /* ✅ IMPORTANT FIX ICI */
  const status = formatStatus(data.changeStatusLabel)

  let statusIcon
  let statusStyle
  let borderColor

  switch (status) {
    case 'En attente':
      statusIcon = <Clock className="w-4 h-4" />
      statusStyle = 'bg-yellow-100 text-yellow-700'
      borderColor = 'border-yellow-400'
      break

    case 'Approuvé':
      statusIcon = <CheckCircle className="w-4 h-4" />
      statusStyle = 'bg-green-100 text-green-700'
      borderColor = 'border-green-500'
      break

    case 'Refusé':
      statusIcon = <XCircle className="w-4 h-4" />
      statusStyle = 'bg-red-100 text-red-700'
      borderColor = 'border-red-500'
      break
  }

  const type =
    data.changeType === 'RoomChange'
      ? 'Changement de salle'
      : 'Proposition de récupération de séance'

  return (
    <div
      onClick={onViewDetails}
      className={`bg-[#F4F6F8] rounded-2xl border-l-4 ${borderColor} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-3 flex-1">

          <div
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full w-fit ${statusStyle}`}
          >
            {statusIcon} {status}
          </div>

          <h3 className="text-xl font-bold text-[#003A68]">
            {data.teacherName}
          </h3>

          <p className="text-gray-800 font-medium">
            {data.courseName}
          </p>

          <div className="text-sm text-gray-500 mt-2">
            <p>
              Demande envoyée le{' '}
              {new Date(data.requestDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="flex flex-col items-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
              data.changeType === 'RoomChange'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {type}
          </span>

          <button
            onClick={onViewDetails}
            className="mt-2 flex items-center gap-2 text-white bg-[#003A68] hover:bg-[#00509E] px-4 py-2 rounded-xl text-sm"
          >
            Voir détails
          </button>
        </div>

      </div>
    </div>
  )
}