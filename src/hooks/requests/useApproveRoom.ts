import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionChangeService} from '@/services/requestservices'

export function useApproveRoom() {
  const queryClient = useQueryClient()
  const { approveRoom } = useSessionChangeService()

  return useMutation({
    mutationFn: approveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionChanges'] })
    },
  })
}