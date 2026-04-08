export interface PlanningSessionDto {
  id: string | null
  startDateTime: string
  endDateTime: string
  mode: string | null
  type: string | null
  status: string | null
  room: string | null
  course: string | null
  description: string | null
}

export interface PlanningDayDto {
  date: string
  dayName: string | null
  sessions: PlanningSessionDto[] | null
}

export interface PlanningWeekDto {
  weekStartDate: string
  weekEndDate: string
  weekdays: PlanningDayDto[] | null
}

export interface PlanningFilters {
  groupId?: string
  trackId?: string
  programId?: string
  startDate?: string
  endDate?: string
}
