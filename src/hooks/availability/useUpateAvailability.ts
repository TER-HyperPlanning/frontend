import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailabilityService } from "../../services/availabilityServices";
import type { AvailabilityPut } from "../../types/date";

export function useUpdateAvailability(){
    const queryClient= useQueryClient()
    const {putAvailability}= useAvailabilityService()
    return useMutation({
        mutationFn:({id,data} : {id:string,data:AvailabilityPut})=>putAvailability(id,data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["availability"]})
        }
    }
    )

}