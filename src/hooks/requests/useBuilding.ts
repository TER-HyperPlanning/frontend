import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useBuilding(buildingId?: string) {
  const { getBuilding } = useSessionChangeService()

  return useQuery({
    queryKey: ['building', buildingId],
    queryFn: () => getBuilding(buildingId!),
    enabled: !!buildingId,
  })
}