import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBuilding } from "@/hooks/api/buildings";

export function useDeleteBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBuilding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },
    });
}