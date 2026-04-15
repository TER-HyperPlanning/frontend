import { useQuery } from "@tanstack/react-query";
import { useAvailabilityGroupService } from "../../services/availabilityGroupService";
import type { GroupPropsEndPointRes } from '../../types/date';
export function useAvailabilityGroup(teacherId: string){
    const {getAvailabilityGroup} = useAvailabilityGroupService()

    return useQuery<GroupPropsEndPointRes[]>({
        queryKey:["availabilityGroup", teacherId],
        queryFn: () => getAvailabilityGroup(teacherId),
        initialData:[]
    })
    
}   