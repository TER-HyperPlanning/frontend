import { useQuery } from "@tanstack/react-query";
import { useweekDayService } from "../../services/weekDayService";
import type { WeekDayReponse } from "../../types/date";

export function useWeekDay(){
    const {getWeekDay}=useweekDayService()

    return useQuery<WeekDayReponse[]>({
        queryKey:["weekDay"],
        queryFn:getWeekDay,
        initialData:[]
    }
    )
}