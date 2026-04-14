import { useQuery } from "@tanstack/react-query";
import { getBuildings, type Building } from "@/hooks/api/buildings";

export function useBuildings() {
    return useQuery<Building[]>({
        queryKey: ["buildings"],
        queryFn: getBuildings,
        initialData: [],
    });
}
