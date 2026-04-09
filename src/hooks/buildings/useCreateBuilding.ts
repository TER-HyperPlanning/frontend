import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBuildingService } from "@/hooks/api/buildings";

export function useCreateBuilding() {
    const queryClient = useQueryClient();
    const { createBuilding } = useBuildingService();

    return useMutation({
        mutationFn: createBuilding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },
    });
}