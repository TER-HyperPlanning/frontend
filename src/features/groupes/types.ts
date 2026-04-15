export interface Group {
  id: string
  name: string
  academicYear: string
  capacity: number
  trackId: string
  programId: string | null
  trackName: string
  programName: string
  studentCount: number
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  groupId: string | null
}

export type SortKey = 'name' | 'academicYear' | 'trackName' | 'programName' | 'studentCount'

export interface SortConfig {
  key: SortKey | null
  direction: 'asc' | 'desc'
}
