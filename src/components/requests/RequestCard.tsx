import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface RequestCardProps {
  status: 'En attente' | 'Approuvé' | 'Refusé'
  teacher: string
  type: 'Changement de salle' | 'Changement de statut' | 'Récupération de séance'
  subject: string
  formation: string
  sessionTime: string
  requestDate: string
}

export default function RequestCard({
  status,
  teacher,
  type,
  subject,
  formation,
  sessionTime,
  requestDate,
}: RequestCardProps) {
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

  return (
    <div
      className={`bg-[#F4F6F8] rounded-2xl border-l-4 ${borderColor} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        
        <div className="flex flex-col gap-3 flex-1">

          
          <div
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full w-fit ${statusStyle}`}
          >
            {statusIcon}
            {status}
          </div>

          
          <h3 className="text-xl font-bold text-[#003A68]">
            {teacher}
          </h3>

          
          <p className="text-gray-800 font-medium">
            {subject}
          </p>

          
          <p className="text-gray-500 text-sm">
            {formation}
          </p>

          
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>Séance : {sessionTime}</p>
            <p>Demande envoyée le {requestDate}</p>
          </div>
        </div>

        
        <div className="flex items-start md:items-center">
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm
              ${
                type === 'Changement de salle'
                  ? 'bg-blue-100 text-blue-700'
                  : type === 'Changement de statut'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-green-100 text-green-700'
              }`}
          >
            {type}
          </span>
        </div>
      </div>
    </div>
  )
}
