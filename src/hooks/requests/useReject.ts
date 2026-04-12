import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useRejectSessionChange() {
  const queryClient = useQueryClient()
  const { rejectSessionChange } = useSessionChangeService()

  return useMutation({
    mutationFn: rejectSessionChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionChanges'] })
    },
  })
}