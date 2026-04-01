import { useEffect, useState, type CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Logo from '@/components/Logo'
import SessionDetailsModal, { type Session } from '@/components/SessionDetailsModal'

const TEACHER_NAME = 'John Doe'

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const DAY_START_HOUR = 8
const DAY_END_HOUR = 19
const DAY_START_MINUTES = DAY_START_HOUR * 60
const DAY_DURATION_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60

// Définition des jours visibles pour créer les colonnes
const VISIBLE_DAYS = [
  { id: 'mon', label: 'Monday', date: '18' },
  { id: 'tue', label: 'Tuesday', date: '19' },
  { id: 'wed', label: 'Wednesday', date: '20' },
  { id: 'thu', label: 'Thursday', date: '17' },
  { id: 'fri', label: 'Friday', date: '18' },
]

const WEEK_NUMBERS = [8, 9, 10, 11, 12, 13, 14]

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function timeStringToMinutes(time?: string) {
  if (!time) return null
  const [hoursStr, minutesStr] = time.split(':')
  const h = Number(hoursStr)
  const m = Number(minutesStr ?? '0')
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

function getNowPercent() {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const clamped = clamp(nowMinutes, DAY_START_MINUTES, DAY_START_MINUTES + DAY_DURATION_MINUTES)
  return ((clamped - DAY_START_MINUTES) / DAY_DURATION_MINUTES) * 100
}

// Fonction pour trouver la bonne colonne en fonction du jour
function getColumnIndex(dateLabel?: string) {
  const label = (dateLabel ?? '').toLowerCase()
  if (label.includes('monday')) return 0
  if (label.includes('tuesday')) return 1
  if (label.includes('wednesday')) return 2
  if (label.includes('thursday')) return 3
  if (label.includes('friday')) return 4
  return 0
}

const mockSessions: Session[] = [
  {
    id: '1',
    course: 'Cours de MPI',
    group: 'L3 Informatique - Groupe A',
    studentCount: 24,
    room: 'TD 02',
    building: 'IBGBI',
    equipment: 'Ordinateur enseignant, vidéoprojecteur.',
    notes: 'Cours de MPI de l’après-midi.',
    dateLabel: 'Thursday 17', // Ira dans la 4ème colonne
    startTime: '13:00',
    endTime: '15:30',
  },
  {
    id: '2',
    course: 'Cours magistral - Bases de données',
    group: 'L2 Informatique - Groupe B',
    studentCount: 80,
    room: 'Amphi 1',
    building: 'IBGBI',
    equipment: 'Vidéoprojecteur, micro.',
    notes: 'Chapitre 3 : Modèle relationnel.',
    dateLabel: 'Monday 18', // Ira dans la 1ère colonne
    startTime: '10:00',
    endTime: '12:00',
  },
  {
    id: '3',
    course: 'TD Algorithmique',
    group: 'L1 Informatique - Groupe C',
    studentCount: 30,
    room: 'TD 05',
    building: 'Bâtiment A',
    equipment: 'Tableau blanc, vidéoprojecteur.',
    notes: 'Exercices sur les tris.',
    dateLabel: 'Tuesday 19',
    startTime: '09:00',
    endTime: '11:00',
  },
  {
    id: '4',
    course: 'Projet encadré',
    group: 'M2 Informatique',
    studentCount: 12,
    room: 'Salle Projet',
    building: 'Bâtiment B',
    equipment: 'Postes informatiques, accès Git.',
    notes: 'Point d’avancement hebdomadaire.',
    dateLabel: 'Wednesday 20',
    startTime: '14:00',
    endTime: '17:00',
  },
  {
    id: '5',
    course: 'TP - Programmation Web',
    group: 'M1 Informatique - TP 2',
    studentCount: 20,
    room: 'Salle Info 3',
    building: 'IBGBI',
    equipment: 'Postes étudiants, IDE.',
    notes: 'Apporter identifiants Git.',
    dateLabel: 'Thursday 17', // Ira aussi dans la 4ème colonne
    startTime: '16:00',
    endTime: '18:00',
  },
]

export const Route = createFileRoute('/(app)/planning/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [activeDayId, setActiveDayId] = useState<string>('thu')
  const [nowPercent, setNowPercent] = useState(() => getNowPercent())

  useEffect(() => {
    const id = window.setInterval(() => setNowPercent(getNowPercent()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex h-screen gap-6 bg-[#f4f4f4] p-6 font-sans">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="flex w-[260px] flex-col rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 shadow-inner">
            {/* Avatar Placeholder */}
            <span className="text-sm font-bold">JD</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Hello,</p>
            <p className="font-semibold text-gray-800 text-sm truncate w-32">{TEACHER_NAME}</p>
            <p className="text-[11px] text-gray-400">Enseignant</p>
          </div>
        </div>

        <nav className="space-y-3">
          <button
            type="button"
            className="w-full rounded-xl bg-[#003b5c] px-4 py-3 text-left text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
          >
            Callander
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Les Demande de changement
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Historique des changements
          </button>
        </nav>

        <div className="mt-auto rounded-2xl bg-[#fafafa] p-4 border border-gray-100 min-h-[180px] flex flex-col">
          <p className="mb-2 text-sm font-bold text-gray-800">Seance Unscheduled :</p>
          <div className="mt-auto border-t border-gray-200 pt-3">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Cette section est en mode hors-ligne et sert uniquement à organiser vos séances par glisser-déposer.
            </p>
          </div>
        </div>
      </aside>

      {/* ZONE PRINCIPALE PLANNING */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm">
        
        {/* HEADER (Top Bar) */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo showText className="h-8 text-[#003b5c]" />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 rounded-xl bg-[#003b5c] px-4 py-2.5 text-sm font-medium text-white shadow-sm">
              Mode
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-[#003b5c] hover:bg-gray-200">
              Filiere
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-[#003b5c] hover:bg-gray-200">
              Formation
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Bell className="h-5 w-5 fill-current" />
            </button>
          </div>
        </header>

        {/* BANDEAU NUMÉROS DE SEMAINE (style pastilles comme sur la maquette) */}
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-1 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
            {WEEK_NUMBERS.map((week, index) => {
              const activeWeek = 12
              const isActive = week === activeWeek
              const distanceFromActive = Math.abs(index - WEEK_NUMBERS.indexOf(activeWeek))
              const showNumber = distanceFromActive <= 1

              return (
                <button
                  key={week}
                  type="button"
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#003b5c] text-white shadow-sm'
                      : 'bg-[#f4f5f7] text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {showNumber ? week : ''}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* BANDEAU DES DATES (Carousel) */}
        <div className="mb-6 flex items-center gap-4">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex flex-1 gap-4 overflow-hidden px-2">
            {VISIBLE_DAYS.map((day) => {
              const isActive = day.id === activeDayId
              
              return (
                <button
                  key={day.id} 
                  className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-3 ${
                    isActive ? 'bg-[#2a2a2a] text-white shadow-md' : 'bg-[#f8f9fa] text-gray-500'
                  }`}
                  type="button"
                  onClick={() => setActiveDayId(day.id)}
                >
                  <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                    {day.label}
                  </span>
                  <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {day.date}
                  </span>
                </button>
              )
            })}
          </div>

          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* GRILLE HORAIRE */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden rounded-3xl bg-white pr-2">
          <div className="flex h-[800px] gap-4">
            
            {/* Colonne des heures */}
            <div className="relative w-12 shrink-0 border-r border-gray-100">
              {hours.map((hour) => {
                const percent = (((hour * 60) - DAY_START_MINUTES) / DAY_DURATION_MINUTES) * 100
                return (
                  <span
                    key={hour}
                    className="absolute right-4 text-xs font-medium text-gray-400 -translate-y-1/2"
                    style={{ top: `${percent}%` }}
                  >
                    {hour} am
                  </span>
                )
              })}
            </div>

            {/* Grille principale avec les Jours (Colonnes) */}
            <div className="relative flex-1">
              
              {/* Lignes horizontales pour chaque heure */}
              {hours.map((hour) => {
                const percent = (((hour * 60) - DAY_START_MINUTES) / DAY_DURATION_MINUTES) * 100
                return (
                  <div
                    key={`line-${hour}`}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: `${percent}%` }}
                  />
                )
              })}

              {/* Ligne violette indiquant l'heure actuelle */}
              <div 
                className="absolute left-0 right-0 z-10 border-t-2 border-[#b59cf6] shadow-[0_0_10px_rgba(181,156,246,0.5)]" 
                style={{ top: `${nowPercent}%` }} 
              />

              {/* Conteneur des colonnes verticales invisibles pour structurer */}
              <div className="absolute inset-0 flex">
                {VISIBLE_DAYS.map((day) => (
                  <div key={`col-${day.id}`} className="flex-1 border-r border-gray-50/50" />
                ))}
              </div>

              {/* Placement des Séances (filtrées par jour actif) */}
              {mockSessions.map((session) => {
                const startMinutes = timeStringToMinutes(session.startTime) ?? DAY_START_MINUTES
                const endMinutes = timeStringToMinutes(session.endTime) ?? Math.min(startMinutes + 60, DAY_START_MINUTES + DAY_DURATION_MINUTES)
                const clampedStart = clamp(startMinutes, DAY_START_MINUTES, DAY_START_MINUTES + DAY_DURATION_MINUTES)
                const clampedEnd = clamp(Math.max(clampedStart + 30, endMinutes), DAY_START_MINUTES, DAY_START_MINUTES + DAY_DURATION_MINUTES)

                // Calcul vertical (Temps)
                const topPercent = ((clampedStart - DAY_START_MINUTES) / DAY_DURATION_MINUTES) * 100
                const heightPercent = ((clampedEnd - clampedStart) / DAY_DURATION_MINUTES) * 100

                // Calcul Horizontal (Colonnes) en fonction du jour actif
                const activeColIndex = VISIBLE_DAYS.findIndex((d) => d.id === activeDayId)
                const sessionColIndex = getColumnIndex(session.dateLabel)

                if (sessionColIndex !== activeColIndex) {
                  return null
                }

                const colIndex = activeColIndex < 0 ? 0 : activeColIndex
                const totalCols = VISIBLE_DAYS.length
                const colWidth = 100 / totalCols
                
                const style: CSSProperties = {
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  left: `calc(${colIndex * colWidth}% + 6px)`,
                  width: `calc(${colWidth}% - 12px)`, // Un peu d'espacement entre les cartes
                }

                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedSession(session)}
                    style={style}
                    className="absolute flex flex-col items-center justify-center rounded-2xl bg-[#f4f6fa] p-2 text-center transition-all hover:bg-blue-50 hover:shadow-md border border-[#e4e9f2] z-20"
                  >
                    <span className="text-xs font-bold text-[#003b5c]">
                      {session.room}
                    </span>
                    <span className="mt-1 text-[10px] font-medium text-gray-500 line-clamp-2 px-1">
                      {session.course}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  )
}