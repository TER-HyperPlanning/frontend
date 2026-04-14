import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuilding } from "@/hooks/api/buildings";

export function useCreateBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBuilding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },
    });
}