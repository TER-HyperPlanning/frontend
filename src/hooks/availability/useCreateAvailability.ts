import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityService } from "../../services/availabilityServices";

export function useCreateAvailability(){
    const queryClient = useQueryClient()
    const {postAvailability}= useAvailabilityService()
    return useMutation({
        mutationFn:postAvailability,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availability"]})
        }
    
    })
}