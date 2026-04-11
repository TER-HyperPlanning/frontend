import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoomService } from "@/hooks/api/rooms";

export function useDeleteRoom() {
  const { deleteRoom } = useRoomService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}