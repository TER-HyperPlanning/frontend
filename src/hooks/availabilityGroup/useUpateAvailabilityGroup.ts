import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityGroupService } from "../../services/availabilityGroupService";
import type { AvailabilityPut } from "../../types/date";

export function useUpdateAvailabilityGroup(){
    const queryClient= useQueryClient()
    const {putAvailabilityGroup}= useAvailabilityGroupService()
    return useMutation({
        mutationFn:({id,data} : {id:string,data:AvailabilityPut})=>putAvailabilityGroup(id,data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availability"]})
        }
    }
    )

}