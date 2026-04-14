import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBuilding } from "@/hooks/api/buildings";

export function useUpdateBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            updateBuilding(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
        },
    });
}