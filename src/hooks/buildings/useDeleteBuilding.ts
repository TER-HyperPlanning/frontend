import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBuildingService } from "@/hooks/api/buildings";

export function useDeleteBuilding() {
    const queryClient = useQueryClient();
    const { deleteBuilding } = useBuildingService();

    return useMutation({
        mutationFn: deleteBuilding,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },

        onError: (error: any) => {
            console.error("Erreur API:", error);
        }
    });
}