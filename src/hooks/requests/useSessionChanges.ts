import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'
import type { SessionChange } from '@/types/sessionChange'

export function useSessionChanges() {
  const { getRequests } = useSessionChangeService()

  return useQuery<SessionChange[]>({
    queryKey: ['sessionChanges'],
    queryFn: getRequests,
  })
}