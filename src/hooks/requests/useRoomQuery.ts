import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useRoom(roomId?: string) {
  const { getRoom } = useSessionChangeService()

  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoom(roomId!),
    enabled: !!roomId, // 🔥 très important
  })
}