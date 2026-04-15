import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useSessionChange(id: string) {
  const { getSessionChangeById } = useSessionChangeService()

  return useQuery({
    queryKey: ['sessionChange', id],
    queryFn: () => getSessionChangeById(id),
    enabled: !!id,
  })
}