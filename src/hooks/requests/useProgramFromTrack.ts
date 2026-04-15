import { useQuery } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useProgram(programId?: string) {
  const { getProgram } = useSessionChangeService()

  return useQuery({
    queryKey: ['program', programId],
    queryFn: () => getProgram(programId!),
    enabled: !!programId,
  })
}