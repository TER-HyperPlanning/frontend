import { useQuery } from "@tanstack/react-query";
import { useAvailabilityService } from "../../services/availabilityServices";
import type { AvailabilityGet, AvailabilityPost } from '../../types/date';

export function useAvailability(teacherId : string){
    const {getAvailabilities} = useAvailabilityService()

    return useQuery<AvailabilityGet[]>({
        queryKey:["availability"],
        queryFn:()=>getAvailabilities(teacherId),
        initialData:[]
    })
    
}