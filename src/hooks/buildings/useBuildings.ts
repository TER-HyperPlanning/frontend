import { useQuery } from "@tanstack/react-query";
import type {Building} from "@/hooks/api/buildings";
import {  useBuildingService } from "@/hooks/api/buildings";

export function useBuildings() {
    const { getBuildings } = useBuildingService();

    return useQuery<Array<Building>>({
        queryKey: ["buildings"],
        queryFn: getBuildings,
        initialData: [],
    });
}
