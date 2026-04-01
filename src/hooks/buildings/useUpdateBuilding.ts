import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBuildingService } from "@/hooks/api/buildings";

export function useUpdateBuilding() {
    const queryClient = useQueryClient();
    const { updateBuilding } = useBuildingService();

    return useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            updateBuilding(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },
    });
}