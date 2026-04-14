import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBuildingService } from "@/hooks/api/buildings";

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

export function useSearchBuilding(search: string) {
    const { getBuildings } = useBuildingService();

    const debouncedSearch = useDebounce(search, 400);

    return useQuery({
        queryKey: ["buildings", debouncedSearch],
        queryFn: () => getBuildings(debouncedSearch),
        initialData: [],
    });
}