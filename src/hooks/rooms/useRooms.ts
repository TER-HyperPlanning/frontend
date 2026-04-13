import { useQuery } from "@tanstack/react-query";
import { useRoomService } from "@/hooks/api/rooms";

export function useRooms() {
    const { getRooms } = useRoomService();

    return useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            const res = await getRooms();
            return res || [];
        },
        initialData: [],
    });
}