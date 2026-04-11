import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RoomRequest } from "@/hooks/api/rooms";
import { useRoomService } from "@/hooks/api/rooms";

export function useCreateRoom() {
  const { createRoom } = useRoomService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });


}

export function useCreateMultipleRooms() {
  const { createRoom } = useRoomService();
  const queryClient = useQueryClient();

  const createRooms = async (rooms: Array<RoomRequest>) => {
    const results = [];

    for (const room of rooms) {
      try {
        const res = await createRoom(room);
        results.push(res);
      } catch (err) {
        console.error("Room creation failed:", room, err);
        throw err;
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["rooms"] });

    return results;
  };

  return { createRooms };
}