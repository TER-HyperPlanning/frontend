import type { ReactNode } from 'react'
import { X, Clock, MapPin, Users, BookOpen, User } from 'lucide-react'
import type { DetailsSeance } from './types'

export interface SeanceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  seance: DetailsSeance | null
}

function formatPlageHoraire(start: Date, end: Date) {
  const opt: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
  const dOpt: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return {
    date: start.toLocaleDateString('fr-FR', dOpt),
    heure: `${start.toLocaleTimeString('fr-FR', opt)} – ${end.toLocaleTimeString('fr-FR', opt)}`,
  }
}

function Row({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="shrink-0 text-primary-700 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 font-medium break-words">{value}</p>
      </div>
    </div>
  )
}

export default function SeanceDetailsModal({ isOpen, onClose, seance }: SeanceDetailsModalProps) {
  if (!isOpen || !seance) return null

  const { date, heure } = formatPlageHoraire(seance.start, seance.end)
  const hasMeta =
    !!(seance.module || seance.groupe || seance.enseignant || seance.salle || seance.batiment)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seance-details-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 id="seance-details-title" className="text-2xl font-bold text-[#003A68] pr-10 mb-1">
          {seance.title}
        </h2>
        {seance.typeSeance ? (
          <p className="text-sm text-gray-500 mb-4">{seance.typeSeance}</p>
        ) : (
          <div className="mb-4" />
        )}

        <div className="rounded-xl bg-slate-50 px-4 py-3 mb-4">
          <p className="text-sm font-semibold text-gray-800 capitalize">{date}</p>
          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 shrink-0 text-primary-600" />
            {heure}
          </p>
        </div>

        {seance.description ? (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-gray-700 text-sm leading-relaxed">{seance.description}</p>
          </div>
        ) : null}

        {hasMeta ? (
          <div className="rounded-xl border border-gray-100 px-1">
            {seance.module ? (
              <Row icon={<BookOpen className="w-5 h-5" />} label="Module" value={seance.module} />
            ) : null}
            {seance.groupe ? (
              <Row icon={<Users className="w-5 h-5" />} label="Groupe" value={seance.groupe} />
            ) : null}
            {seance.enseignant ? (
              <Row icon={<User className="w-5 h-5" />} label="Enseignant" value={seance.enseignant} />
            ) : null}
            {seance.salle || seance.batiment ? (
              <Row
                icon={<MapPin className="w-5 h-5" />}
                label="Lieu"
                value={[seance.salle, seance.batiment].filter(Boolean).join(' · ') || '—'}
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="btn btn-primary rounded-full px-6">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
