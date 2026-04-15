import { useQuery } from "@tanstack/react-query";
import { useBuildingService } from "@/hooks/api/buildings";


export function useBuildings(search: string) {
    const { getBuildings } = useBuildingService();

    return useQuery({
        queryKey: ["buildings", search],
        queryFn: () => getBuildings(search),
        initialData: [],
    });
}
