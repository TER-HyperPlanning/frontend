import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useSessionGroups(sessionId?: string) {
  const { getSessionGroups } = useSessionChangeService()

  return useQuery({
    queryKey: ['session-groups', sessionId],
    queryFn: () => getSessionGroups(sessionId!),
    enabled: !!sessionId,
  })
}