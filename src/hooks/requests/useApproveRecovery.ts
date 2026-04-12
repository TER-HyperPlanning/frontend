import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useApproveRecovery() {
  const queryClient = useQueryClient()
  const { approveRecovery } = useSessionChangeService()

  return useMutation({
    mutationFn: approveRecovery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionChanges'] })
    },
  })
}