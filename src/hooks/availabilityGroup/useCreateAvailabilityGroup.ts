import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityGroupService } from "../../services/availabilityGroupService";

export function useCreateAvailabilityGroup(){
    const queryClient = useQueryClient()
    const {postAvailabilityGroup}= useAvailabilityGroupService()
    return useMutation({
        mutationFn:postAvailabilityGroup,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availabilityGroup"]})
        }
    
    })
}
