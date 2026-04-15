import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export const useAvailableRooms = (sessionId?: string) => {
  const { getAvailableRooms } = useSessionChangeService()

  return useQuery({
    queryKey: ['availableRooms', sessionId],
    queryFn: () => getAvailableRooms(sessionId!),
    enabled: !!sessionId,
  })
}