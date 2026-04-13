import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoomService } from "@/hooks/api/rooms";

function useDebounce<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function useSearchRoom(searchTerm: string, filterType: string) {
    const { getRooms } = useRoomService();

    const debouncedSearch = useDebounce(searchTerm, 400);

    return useQuery({
        queryKey: ["rooms", debouncedSearch, filterType],
        queryFn: async () => {
            return await getRooms({
                q: debouncedSearch,
                types: filterType ? [filterType] : undefined,
            });
        },
        initialData: [],
    });
}