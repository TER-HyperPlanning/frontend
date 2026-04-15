import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityGroupService } from "../../services/availabilityGroupService";

export function useDeleteAvailabilityGroup(){
    const queryClient = useQueryClient()
    const {deleteAvailabilityGroup}= useAvailabilityGroupService()
    return useMutation({
        mutationFn:deleteAvailabilityGroup,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availabilityGroup"]})
        }
    })
}