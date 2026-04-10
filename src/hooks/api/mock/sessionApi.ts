/**
 * Mock Session API
 * Single source of truth for calendar data used by the UI.
 * All components should use these functions only.
 */

export type Actor = 'enseignant' | 'student' | 'scolarité' | 'scolarite' | 'admin'
export type UserRole = 'enseignant' | 'admin' | null

export type SessionStatus = 'active' | 'pending' | 'absent'
export type TeacherRequestStatus = 'pending' | 'approved' | 'rejected'

export interface Session {
  id: string
  title: string
  start: Date
  end: Date
  teacherId: string
  teacherName: string
  groupId: string
  group: string
  room?: string
  description?: string
  remarks?: string
  equipment?: string[]
  studentsCount?: number
  status: SessionStatus
}

export interface SessionTooltipData {
  id: string
  title: string
  time: string
  group: string
  room?: string
  description?: string
  teacherName: string
}

export interface TeacherRequest {
  id: string
  sessionId: string
  type: 'reschedule' | 'absence'
  status: TeacherRequestStatus
  createdAt: Date
  teacherId: string
  teacherName: string
  sessionTitle: string
  oldStart?: Date
  oldEnd?: Date
  newStart?: Date
  newEnd?: Date
  reason?: string
}

export interface Disponibility {
  day: string
  start: string
  end: string
}

export interface AvailabilityCheckResult {
  ok: boolean
  reason?: string
}

export interface GetDisponibilitiesOptions {
  sessionId?: string
  durationMinutes?: number
  daysAhead?: number
}

export const SESSION_DURATION = 90

export const buildSessionEnd = (
  start: Date,
  durationMinutes: number = SESSION_DURATION,
): Date => {
  return new Date(start.getTime() + durationMinutes * 60_000)
}

const API_DELAY = {
  short: 150,
  medium: 250,
  long: 400,
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function createDate(base: Date, dayOffset: number, hours: number, minutes: number): Date {
  const d = addDays(base, dayOffset)
  d.setHours(hours, minutes, 0, 0)
  return d
}

function cloneSession(session: Session): Session {
  return {
    ...session,
    start: new Date(session.start),
    end: new Date(session.end),
    equipment: session.equipment ? [...session.equipment] : undefined,
  }
}

function cloneRequest(request: TeacherRequest): TeacherRequest {
  return {
    ...request,
    createdAt: new Date(request.createdAt),
    oldStart: request.oldStart ? new Date(request.oldStart) : undefined,
    oldEnd: request.oldEnd ? new Date(request.oldEnd) : undefined,
    newStart: request.newStart ? new Date(request.newStart) : undefined,
    newEnd: request.newEnd ? new Date(request.newEnd) : undefined,
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function dayNameEn(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function getMinutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function sameDateTime(a?: Date, b?: Date): boolean {
  if (!a || !b) return false
  return a.getTime() === b.getTime()
}

const weekBase = startOfWeek(new Date())

let MOCK_SESSIONS: Session[] = [
  {
    id: 'sess_1',
    title: 'TD 02 - React',
    start: createDate(weekBase, 0, 10, 0),
    end: createDate(weekBase, 0, 11, 30),
    teacherId: 'prof_1',
    teacherName: 'Jean Dupont',
    groupId: 'group_a1',
    group: 'Groupe A1',
    room: 'Salle 101',
    description: 'Implémentation de composants React',
    remarks: 'Apporter vos laptops',
    equipment: ['Vidéoprojecteur', 'Tableau blanc'],
    studentsCount: 28,
    status: 'active',
  },
  {
    id: 'sess_2',
    title: 'Cours C++',
    start: createDate(weekBase, 1, 14, 0),
    end: createDate(weekBase, 1, 15, 30),
    teacherId: 'prof_2',
    teacherName: 'Marie Lambert',
    groupId: 'group_a1',
    group: 'Groupe A1',
    room: 'Amphi 1',
    description: 'Pointeurs et gestion mémoire',
    remarks: 'Présence recommandée',
    equipment: ['Vidéoprojecteur'],
    studentsCount: 28,
    status: 'active',
  },
  {
    id: 'sess_3',
    title: 'TP Réseau',
    start: createDate(weekBase, 2, 9, 0),
    end: createDate(weekBase, 2, 10, 30),
    teacherId: 'prof_1',
    teacherName: 'Jean Dupont',
    groupId: 'group_b2',
    group: 'Groupe B2',
    room: 'Lab 2',
    description: 'Configuration TCP/IP',
    equipment: ['Ordinateurs', 'Équipement réseau'],
    studentsCount: 25,
    status: 'active',
  },
  {
    id: 'sess_4',
    title: 'TP Web',
    start: createDate(weekBase, 3, 11, 0),
    end: createDate(weekBase, 3, 12, 30),
    teacherId: 'prof_2',
    teacherName: 'Marie Lambert',
    groupId: 'group_b2',
    group: 'Groupe B2',
    room: 'Lab 1',
    description: 'HTML / CSS / JavaScript',
    equipment: ['Ordinateurs'],
    studentsCount: 25,
    status: 'active',
  },
  {
    id: 'sess_5',
    title: 'Révision',
    start: createDate(weekBase, 4, 13, 0),
    end: createDate(weekBase, 4, 14, 30),
    teacherId: 'prof_1',
    teacherName: 'Jean Dupont',
    groupId: 'group_a1',
    group: 'Groupe A1',
    room: 'Salle 103',
    description: 'Séance de révision',
    equipment: ['Tableau blanc'],
    studentsCount: 28,
    status: 'active',
  },
]

let MOCK_TEACHER_REQUESTS: TeacherRequest[] = []

const MOCK_DISPONIBILITIES: Record<string, Disponibility[]> = {
  prof_1: [
    { day: 'Monday', start: '08:00', end: '12:00' },
    { day: 'Monday', start: '14:00', end: '17:00' },
    { day: 'Tuesday', start: '09:00', end: '18:00' },
    { day: 'Wednesday', start: '08:00', end: '18:00' },
    { day: 'Thursday', start: '09:00', end: '17:00' },
    { day: 'Friday', start: '10:00', end: '16:00' },
  ],
  prof_2: [
    { day: 'Monday', start: '10:00', end: '18:00' },
    { day: 'Tuesday', start: '10:00', end: '18:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
    { day: 'Thursday', start: '08:00', end: '16:00' },
    { day: 'Friday', start: '09:00', end: '17:00' },
  ],
  group_a1: [
    { day: 'Monday', start: '08:00', end: '18:00' },
    { day: 'Tuesday', start: '08:00', end: '18:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
    { day: 'Thursday', start: '08:00', end: '18:00' },
    { day: 'Friday', start: '10:00', end: '18:00' },
  ],
  group_b2: [
    { day: 'Monday', start: '09:00', end: '17:00' },
    { day: 'Tuesday', start: '09:00', end: '17:00' },
    { day: 'Wednesday', start: '08:00', end: '18:00' },
    { day: 'Thursday', start: '10:00', end: '18:00' },
    { day: 'Friday', start: '09:00', end: '17:00' },
  ],
}

function getSessionInternal(sessionId: string): Session | undefined {
  return MOCK_SESSIONS.find((session) => session.id === sessionId)
}

function getPendingRequestBySessionId(sessionId: string): TeacherRequest | undefined {
  return MOCK_TEACHER_REQUESTS.find(
    (request) => request.sessionId === sessionId && request.status === 'pending',
  )
}

function rangesIntersect(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime()
}

function hasCollision(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
  teacherId: string,
  groupId: string,
): boolean {
  return MOCK_SESSIONS.some((session) => {
    if (session.id === sessionId) return false
    const sameTeacher = session.teacherId === teacherId
    const sameGroup = session.groupId === groupId
    if (!sameTeacher && !sameGroup) return false
    return rangesIntersect(newStart, newEnd, session.start, session.end)
  })
}

function isRangeInsideDisponibilities(
  start: Date,
  end: Date,
  disponibilities: Disponibility[],
): boolean {
  const day = dayNameEn(start)
  const startMinutes = getMinutesOfDay(start)
  const endMinutes = getMinutesOfDay(end)

  return disponibilities.some((dispo) => {
    if (dispo.day !== day) return false
    const dispoStart = timeToMinutes(dispo.start)
    const dispoEnd = timeToMinutes(dispo.end)
    return startMinutes >= dispoStart && endMinutes <= dispoEnd
  })
}

function getCommonDayRanges(
  teacherDispo: Disponibility[],
  groupDispo: Disponibility[],
): Record<string, Array<{ start: number; end: number }>> {
  const dayMap: Record<string, Array<{ start: number; end: number }>> = {}

  const allDays = new Set([
    ...teacherDispo.map((item) => item.day),
    ...groupDispo.map((item) => item.day),
  ])

  allDays.forEach((day) => {
    const teacherDayRanges = teacherDispo.filter((item) => item.day === day)
    const groupDayRanges = groupDispo.filter((item) => item.day === day)

    const intersections: Array<{ start: number; end: number }> = []

    teacherDayRanges.forEach((teacherRange) => {
      groupDayRanges.forEach((groupRange) => {
        const start = Math.max(
          timeToMinutes(teacherRange.start),
          timeToMinutes(groupRange.start),
        )
        const end = Math.min(
          timeToMinutes(teacherRange.end),
          timeToMinutes(groupRange.end),
        )

        if (start < end) {
          intersections.push({ start, end })
        }
      })
    })

    dayMap[day] = intersections
  })

  return dayMap
}

function buildConcreteAvailableSlots(
  teacherId: string,
  groupId: string,
  options?: GetDisponibilitiesOptions,
): string[] {
  const teacherDispo = MOCK_DISPONIBILITIES[teacherId] || []
  const groupDispo = MOCK_DISPONIBILITIES[groupId] || []
  const commonRanges = getCommonDayRanges(teacherDispo, groupDispo)

  const durationMinutes = options?.durationMinutes ?? SESSION_DURATION
  const daysAhead = options?.daysAhead ?? 14
  const sessionId = options?.sessionId

  const slots: string[] = []
  const today = new Date()

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const currentDate = addDays(today, offset)
    currentDate.setHours(0, 0, 0, 0)

    const day = dayNameEn(currentDate)
    const ranges = commonRanges[day] || []

    ranges.forEach((range) => {
      for (let minute = range.start; minute + durationMinutes <= range.end; minute += 30) {
        const candidateStart = new Date(currentDate)
        candidateStart.setHours(Math.floor(minute / 60), minute % 60, 0, 0)

        const candidateEnd = buildSessionEnd(candidateStart, durationMinutes)

        if (candidateStart.getTime() <= Date.now()) {
          continue
        }

        const conflict = sessionId
          ? hasCollision(sessionId, candidateStart, candidateEnd, teacherId, groupId)
          : hasCollision('__none__', candidateStart, candidateEnd, teacherId, groupId)

        if (conflict) {
          continue
        }

        slots.push(candidateStart.toISOString())
      }
    })
  }

  return slots
}

export function checkRescheduleAvailability(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
): AvailabilityCheckResult {
  const session = getSessionInternal(sessionId)

  if (!session) {
    return { ok: false, reason: 'Séance introuvable.' }
  }

  const teacherDispo = MOCK_DISPONIBILITIES[session.teacherId] || []
  const groupDispo = MOCK_DISPONIBILITIES[session.groupId] || []

  const teacherAvailable = isRangeInsideDisponibilities(newStart, newEnd, teacherDispo)
  const groupAvailable = isRangeInsideDisponibilities(newStart, newEnd, groupDispo)

  if (!teacherAvailable && !groupAvailable) {
    return { ok: false, reason: 'L’enseignant et le groupe ne sont pas disponibles sur ce créneau.' }
  }

  if (!teacherAvailable) {
    return { ok: false, reason: 'L’enseignant n’est pas disponible sur ce créneau.' }
  }

  if (!groupAvailable) {
    return { ok: false, reason: 'Le groupe n’est pas disponible sur ce créneau.' }
  }

  if (hasCollision(sessionId, newStart, newEnd, session.teacherId, session.groupId)) {
    return { ok: false, reason: 'Ce créneau entre en conflit avec une autre séance.' }
  }

  return { ok: true }
}

export async function getSessions(): Promise<Session[]> {
  await wait(API_DELAY.medium)

  return MOCK_SESSIONS
    .map(cloneSession)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  await wait(API_DELAY.short)

  const session = getSessionInternal(sessionId)
  return session ? cloneSession(session) : null
}

export async function getSessionDetails(
  sessionId: string,
): Promise<SessionTooltipData | null> {
  await wait(API_DELAY.short)

  const session = getSessionInternal(sessionId)

  if (!session) {
    return null
  }

  return {
    id: session.id,
    title: session.title,
    time: `${formatTime(session.start)} - ${formatTime(session.end)}`,
    group: session.group,
    room: session.room,
    description: session.description,
    teacherName: session.teacherName,
  }
}

export async function getDisponibilities(
  teacherId: string,
  groupId: string,
  options?: GetDisponibilitiesOptions,
): Promise<string[]> {
  await wait(API_DELAY.short)
  return buildConcreteAvailableSlots(teacherId, groupId, options)
}

export async function declareAbsence(
  sessionId: string,
  role: UserRole = 'enseignant',
): Promise<boolean> {
  await wait(API_DELAY.long)

  const session = getSessionInternal(sessionId)
  if (!session) {
    return false
  }

  if (role === 'admin') {
    session.status = 'absent'
    return true
  }

  const existingPending = getPendingRequestBySessionId(sessionId)
  if (existingPending) {
    return false
  }

  session.status = 'pending'

  MOCK_TEACHER_REQUESTS.push({
    id: `req_abs_${Date.now()}`,
    sessionId: session.id,
    type: 'absence',
    status: 'pending',
    createdAt: new Date(),
    teacherId: session.teacherId,
    teacherName: session.teacherName,
    sessionTitle: session.title,
  })

  return true
}

export async function requestReschedule(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
): Promise<boolean> {
  await wait(API_DELAY.long)

  const session = getSessionInternal(sessionId)
  if (!session) {
    return false
  }

  const validation = checkRescheduleAvailability(sessionId, newStart, newEnd)
  if (!validation.ok) {
    return false
  }

  const existingPending = getPendingRequestBySessionId(sessionId)

  if (existingPending) {
    existingPending.oldStart = existingPending.oldStart ?? new Date(session.start)
    existingPending.oldEnd = existingPending.oldEnd ?? new Date(session.end)
    existingPending.newStart = new Date(newStart)
    existingPending.newEnd = new Date(newEnd)
    existingPending.createdAt = new Date()
  } else {
    MOCK_TEACHER_REQUESTS.push({
      id: `req_res_${Date.now()}`,
      sessionId: session.id,
      type: 'reschedule',
      status: 'pending',
      createdAt: new Date(),
      teacherId: session.teacherId,
      teacherName: session.teacherName,
      sessionTitle: session.title,
      oldStart: new Date(session.start),
      oldEnd: new Date(session.end),
      newStart: new Date(newStart),
      newEnd: new Date(newEnd),
    })
  }

  session.start = new Date(newStart)
  session.end = new Date(newEnd)
  session.status = 'pending'

  return true
}

export async function cancelTeacherRequest(sessionId: string): Promise<boolean> {
  await wait(API_DELAY.medium)

  const session = getSessionInternal(sessionId)
  const request = getPendingRequestBySessionId(sessionId)

  if (!session || !request) {
    return false
  }

  if (request.type === 'reschedule') {
    if (request.oldStart && request.oldEnd) {
      session.start = new Date(request.oldStart)
      session.end = new Date(request.oldEnd)
    }
    session.status = 'active'
  }

  if (request.type === 'absence') {
    session.status = 'active'
  }

  request.status = 'rejected'
  return true
}

export async function getTeacherRequests(): Promise<TeacherRequest[]> {
  await wait(API_DELAY.short)
  return MOCK_TEACHER_REQUESTS.map(cloneRequest)
}

export async function getTeacherRequestsByTeacherId(
  teacherId: string,
): Promise<TeacherRequest[]> {
  await wait(API_DELAY.short)

  return MOCK_TEACHER_REQUESTS
    .filter((request) => request.teacherId === teacherId)
    .map(cloneRequest)
}

export async function adminConfirmRequest(
  requestId: string,
  action: 'approve' | 'reject',
): Promise<boolean> {
  await wait(API_DELAY.long)

  const request = MOCK_TEACHER_REQUESTS.find((item) => item.id === requestId)
  if (!request) {
    return false
  }

  const session = getSessionInternal(request.sessionId)
  if (!session) {
    return false
  }

  request.status = action === 'approve' ? 'approved' : 'rejected'

  if (request.type === 'absence') {
    if (action === 'approve') {
      session.status = 'absent'
    } else {
      session.status = 'active'
    }
    return true
  }

  if (request.type === 'reschedule') {
    if (action === 'approve') {
      if (request.newStart && request.newEnd) {
        session.start = new Date(request.newStart)
        session.end = new Date(request.newEnd)
      }
      session.status = 'active'
      return true
    }

    if (request.oldStart && request.oldEnd) {
      session.start = new Date(request.oldStart)
      session.end = new Date(request.oldEnd)
    }
    session.status = 'active'
    return true
  }

  return false
}

export async function adminRescheduleSession(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
): Promise<boolean> {
  await wait(API_DELAY.long)

  const session = getSessionInternal(sessionId)
  if (!session) {
    return false
  }

  const validation = checkRescheduleAvailability(sessionId, newStart, newEnd)
  if (!validation.ok) {
    return false
  }

  session.start = new Date(newStart)
  session.end = new Date(newEnd)
  session.status = 'active'

  return true
}

export async function createSession(input: {
  title: string
  start: Date
  teacherId: string
  teacherName: string
  groupId: string
  group: string
  room?: string
  description?: string
  remarks?: string
  equipment?: string[]
  studentsCount?: number
}): Promise<boolean> {
  await wait(API_DELAY.long)

  const end = buildSessionEnd(input.start)
  const teacherDispo = MOCK_DISPONIBILITIES[input.teacherId] || []
  const groupDispo = MOCK_DISPONIBILITIES[input.groupId] || []

  const teacherAvailable = isRangeInsideDisponibilities(input.start, end, teacherDispo)
  const groupAvailable = isRangeInsideDisponibilities(input.start, end, groupDispo)

  if (!teacherAvailable || !groupAvailable) {
    return false
  }

  const hasConflict = hasCollision(
    '__new__',
    input.start,
    end,
    input.teacherId,
    input.groupId,
  )

  if (hasConflict) {
    return false
  }

  MOCK_SESSIONS.push({
    id: `sess_${Date.now()}`,
    title: input.title,
    start: new Date(input.start),
    end,
    teacherId: input.teacherId,
    teacherName: input.teacherName,
    groupId: input.groupId,
    group: input.group,
    room: input.room,
    description: input.description,
    remarks: input.remarks,
    equipment: input.equipment,
    studentsCount: input.studentsCount,
    status: 'active',
  })

  return true
}

export async function updateDisponibilities(
  actorId: string,
  disponibilities: Disponibility[],
): Promise<boolean> {
  await wait(API_DELAY.medium)
  MOCK_DISPONIBILITIES[actorId] = disponibilities.map((item) => ({ ...item }))
  return true
}

export function getPendingRequestIdBySessionId(sessionId: string): string | null {
  const request = getPendingRequestBySessionId(sessionId)
  return request?.id ?? null
}

export function __resetMockSessionDataForDevOnly() {
  MOCK_TEACHER_REQUESTS = []
}
