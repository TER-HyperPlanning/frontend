import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useTrack(trackId?: string) {
  const { getTrack } = useSessionChangeService()

  return useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getTrack(trackId!),
    enabled: !!trackId,
  })
}