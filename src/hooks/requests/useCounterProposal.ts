import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionChangeService } from '@/services/requestservices'

export function useCounterProposal() {
  const queryClient = useQueryClient()
  const { counterProposal } = useSessionChangeService()

  return useMutation({
    mutationFn: counterProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionChanges'] })
    },
  })
}