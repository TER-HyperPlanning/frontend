import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoomService } from "../api/rooms";
import type { RoomRequest } from "../api/rooms";

export function useUpdateRoom() {
  const { updateRoom } = useRoomService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoomRequest }) =>
      updateRoom(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });
}