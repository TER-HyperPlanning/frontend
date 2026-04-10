import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityService } from "../../services/availabilityServices";

export function useDeleteAvailability(){
    const queryClient = useQueryClient()
    const {deleteAvailability}= useAvailabilityService()
    return useMutation({
        mutationFn:deleteAvailability,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availability"]})
        }
    })
}