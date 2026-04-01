import { useQuery } from "@tanstack/react-query";
import { useBuildingService, type Building } from "@/hooks/api/buildings";

export function useBuildings() {
    const { getBuildings } = useBuildingService();

    return useQuery<Building[]>({
        queryKey: ["buildings"],
        queryFn: getBuildings,
        initialData: [],
    });
}
