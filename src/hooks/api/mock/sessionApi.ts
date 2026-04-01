/**
 * Mock Session API - Development Only
 * Simulates backend behavior with async delays
 * Ready to switch to real API (sessionApi.ts) by changing imports
 */

export type Actor = 'enseignant' | 'student' | 'scolarité'

export interface Session {
  id: string
  title: string
  start: Date
  end: Date
  teacherId: string
  groupId: string
  status: 'active' | 'pending' | 'absent'
  description?: string
  remarks?: string
}

export interface Disponibility {
  day: string // e.g., "Monday", "Tuesday"
  start: string // e.g., "08:00"
  end: string // e.g., "18:00"
}

export const SESSION_DURATION = 90 // minutes

export const buildSessionEnd = (start: Date) => {
  return new Date(start.getTime() + SESSION_DURATION * 60000)
}

// Mock data - 5 sessions with fixed 1h30 duration
const MOCK_SESSIONS: Session[] = [
  {
    id: 'sess_1',
    title: 'TD 02 - React',
    start: new Date(2026, 3, 1, 10, 0), // Tuesday 10:00
    end: new Date(2026, 3, 1, 11, 30), // Tuesday 11:30 (1h30 fixed)
    teacherId: 'prof_1',
    groupId: 'group_1',
    status: 'active',
    description: 'Implémentation de composants React',
    remarks: 'Apportez vos laptops',
  },
  {
    id: 'sess_2',
    title: 'Cours C++',
    start: new Date(2026, 3, 1, 14, 0), // Tuesday 14:00
    end: new Date(2026, 3, 1, 15, 30), // Tuesday 15:30 (1h30 fixed)
    teacherId: 'prof_2',
    groupId: 'group_1',
    status: 'active',
    description: 'Pointeurs et gestion mémoire',
    remarks: 'Session importante',
  },
  {
    id: 'sess_3',
    title: 'TP Réseau',
    start: new Date(2026, 3, 2, 9, 0), // Wednesday 09:00
    end: new Date(2026, 3, 2, 10, 30), // Wednesday 10:30 (1h30 fixed)
    teacherId: 'prof_1',
    groupId: 'group_2',
    status: 'active',
    description: 'Configuration TCP/IP',
  },
  {
    id: 'sess_4',
    title: 'Travaux Pratiques Web',
    start: new Date(2026, 3, 3, 11, 0), // Thursday 11:00
    end: new Date(2026, 3, 3, 12, 30), // Thursday 12:30 (1h30 fixed)
    teacherId: 'prof_2',
    groupId: 'group_2',
    status: 'active',
    description: 'HTML, CSS, JavaScript',
  },
  {
    id: 'sess_5',
    title: 'Projet Final',
    start: new Date(2026, 3, 4, 13, 0), // Friday 13:00
    end: new Date(2026, 3, 4, 14, 30), // Friday 14:30 (1h30 fixed)
    teacherId: 'prof_1',
    groupId: 'group_1',
    status: 'active',
    description: 'Présentation des projets finaux',
  },
]

// Mock disponibilities by teacher and group
const MOCK_DISPONIBILITIES: Record<string, Disponibility[]> = {
  prof_1: [
    { day: 'Tuesday', start: '08:00', end: '12:00' },
    { day: 'Tuesday', start: '14:00', end: '18:00' },
    { day: 'Wednesday', start: '08:00', end: '18:00' },
    { day: 'Thursday', start: '09:00', end: '17:00' },
    { day: 'Friday', start: '10:00', end: '16:00' },
  ],
  prof_2: [
    { day: 'Tuesday', start: '10:00', end: '18:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
    { day: 'Thursday', start: '08:00', end: '16:00' },
    { day: 'Friday', start: '11:00', end: '18:00' },
  ],
  group_1: [
    { day: 'Tuesday', start: '08:00', end: '18:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
    { day: 'Thursday', start: '08:00', end: '18:00' },
    { day: 'Friday', start: '10:00', end: '18:00' },
  ],
  group_2: [
    { day: 'Tuesday', start: '09:00', end: '17:00' },
    { day: 'Wednesday', start: '08:00', end: '18:00' },
    { day: 'Thursday', start: '10:00', end: '18:00' },
    { day: 'Friday', start: '09:00', end: '17:00' },
  ],
}

/**
 * Collision detection: check if a time slot overlaps with existing sessions
 * Sessions have fixed duration of 1h30
 */
function hasCollision(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
  teacherId: string,
  groupId: string,
): boolean {
  return MOCK_SESSIONS.some((session) => {
    // Skip the session being moved
    if (session.id === sessionId) return false

    // Check for teacher or group conflict
    const isSameTeacher = session.teacherId === teacherId
    const isSameGroup = session.groupId === groupId

    if (!isSameTeacher && !isSameGroup) return false

    // Check time overlap
    const sessionStart = new Date(session.start).getTime()
    const sessionEnd = new Date(session.end).getTime()
    const newStartTime = newStart.getTime()
    const newEndTime = newEnd.getTime()

    return newStartTime < sessionEnd && newEndTime > sessionStart
  })
}

/**
 * Check if a time slot is within disponibilities
 */
function isTimeInDisponibilities(
  date: Date,
  disponibilities: Disponibility[],
): boolean {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

  return disponibilities.some((d) => {
    if (d.day !== dayName) return false
    return timeStr >= d.start && timeStr < d.end
  })
}

/**
 * Convert available time slots to string format (e.g., "08:00", "09:00", etc.)
 */
function generateAvailableSlots(
  day: string,
  startDispo: string,
  endDispo: string,
): string[] {
  const slots: string[] = []
  const [startHour, startMin] = startDispo.split(':').map(Number)
  const [endHour, endMin] = endDispo.split(':').map(Number)

  let currentHour = startHour
  let currentMin = startMin

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    // Only add slot if there's 1h30 available
    const slotEnd = new Date(2026, 0, 1, currentHour, currentMin)
    slotEnd.setMinutes(slotEnd.getMinutes() + 90)

    if (slotEnd.getHours() < endHour || (slotEnd.getHours() === endHour && slotEnd.getMinutes() <= endMin)) {
      slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`)
    }

    // Move to next hour
    currentHour += 1
  }

  return slots
}

/**
 * Fetch all sessions
 * Simulates API delay: 300ms
 */
export async function getSessions(): Promise<Session[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a copy with Date objects
      const sessions = MOCK_SESSIONS.map((s) => ({
        ...s,
        start: new Date(s.start),
        end: new Date(s.end),
      }))
      resolve(sessions)
    }, 300)
  })
}

/**
 * Fetch disponibilities for a teacher or group
 * Returns array of available time slot strings (e.g., ["08:00", "09:00", ...])
 * Simulates API delay: 200ms
 */
export async function getDisponibilities(
  teacherId: string,
  groupId: string,
): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get disponibilities for both teacher and group
      const teacherDispo = MOCK_DISPONIBILITIES[teacherId] || []
      const groupDispo = MOCK_DISPONIBILITIES[groupId] || []

      // Merge and get unique days
      const allDays = new Set([...teacherDispo, ...groupDispo].map((d) => d.day))
      const availableSlots: string[] = []

      allDays.forEach((day) => {
        const tDays = teacherDispo.filter((d) => d.day === day)
        const gDays = groupDispo.filter((d) => d.day === day)

        // If no availability for this day, skip
        if (tDays.length === 0 || gDays.length === 0) return

        // Find intersection of time ranges
        tDays.forEach((tDay) => {
          gDays.forEach((gDay) => {
            const tStart = parseInt(tDay.start.split(':')[0])
            const tEnd = parseInt(tDay.end.split(':')[0])
            const gStart = parseInt(gDay.start.split(':')[0])
            const gEnd = parseInt(gDay.end.split(':')[0])

            const overlapStart = Math.max(tStart, gStart)
            const overlapEnd = Math.min(tEnd, gEnd)

            if (overlapStart < overlapEnd) {
              // For each overlapping hour, add it as an available slot
              for (let h = overlapStart; h < overlapEnd; h++) {
                availableSlots.push(
                  `${day} ${String(h).padStart(2, '0')}:00`,
                )
              }
            }
          })
        })
      })

      resolve(availableSlots)
    }, 200)
  })
}

/**
 * Signal absence for a session
 * Sets session status to 'absent'
 * Simulates API delay: 400ms
 */
export async function declareAbsence(sessionId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = MOCK_SESSIONS.find((s) => s.id === sessionId)
      if (session) {
        session.status = 'absent'
        resolve(true)
      } else {
        resolve(false)
      }
    }, 400)
  })
}

/**
 * Request to reschedule a session
 * Sets session status to 'pending'
 * Does NOT change session time (that's handled by frontend with confirmation)
 * Simulates API delay: 400ms
 */
export async function requestReschedule(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = MOCK_SESSIONS.find((s) => s.id === sessionId)
      if (!session) {
        resolve(false)
        return
      }

      // Check for collisions before allowing reschedule
      const hasConflict = hasCollision(
        sessionId,
        newStart,
        newEnd,
        session.teacherId,
        session.groupId,
      )

      if (hasConflict) {
        resolve(false)
        return
      }

      // Check if new time is within disponibilities
      const teacherDispo = MOCK_DISPONIBILITIES[session.teacherId] || []
      const groupDispo = MOCK_DISPONIBILITIES[session.groupId] || []

      const isTeacherAvailable = isTimeInDisponibilities(newStart, teacherDispo) &&
        isTimeInDisponibilities(newEnd, teacherDispo)

      const isGroupAvailable = isTimeInDisponibilities(newStart, groupDispo) &&
        isTimeInDisponibilities(newEnd, groupDispo)

      if (!isTeacherAvailable || !isGroupAvailable) {
        resolve(false)
        return
      }

      // Set to pending (will be confirmed by admin)
      session.status = 'pending'
      // In mock, we also update the time (in real API, admin would do this)
      session.start = newStart
      session.end = newEnd

      resolve(true)
    }, 400)
  })
}
