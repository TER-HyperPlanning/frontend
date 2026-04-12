import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService} from '@/services/requestservices'

export function useSessionChanges() {
  const { getRequests } = useSessionChangeService()

  return useQuery({
    queryKey: ['sessionChanges'],
    queryFn: getRequests,
    initialData: [],
  })
}