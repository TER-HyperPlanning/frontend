/** API model — GET /api/Groups (Swagger: GroupModel) */
export interface GroupModel {
  id: string
  name: string
  academicYear: string | null
  trackId: string | null
}
