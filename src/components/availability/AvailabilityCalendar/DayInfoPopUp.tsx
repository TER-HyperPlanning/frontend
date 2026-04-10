import { useState } from "react";
import type { DateAvailability, DayActions } from "../../../types/date";
import { AvailabilityHoursFormForOneDay } from "../../forms/availability/AvailabilityHoursForms/AvailabilityHoursForOneDay";

interface DayInfoPopUpProps {
    posX: number,
    posY: number,
    visible: boolean,
    day: DateAvailability | null,
    dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
}
export const DayInfoPopUp = ({ day, dispatchSelectedDays, posX, posY, visible }: DayInfoPopUpProps) => {
    const posDif = 10
    const[ isInPopUp, setisInPopUp]=useState(false)
    return (
     (day &&   <div 
        //remove mousedown behavior in AvailabilityCalendar
        onMouseDown={(e)=>{e.stopPropagation()}}>
            {(visible || isInPopUp) && (
                <div
                    className="absolute bg-white border border-gray-300 shadow-lg z-1000 p-2.5 origin-top-left scale-70"
                    style={{
                        top: posY + posDif,
                        left: posX + posDif,
                    }}
                    onMouseEnter={() => setisInPopUp(true)}
                    onMouseLeave={() => setisInPopUp(false)}
                >

                        <AvailabilityHoursFormForOneDay
                            dispatchSelectedDays={dispatchSelectedDays}
                            day={day}
                        ></AvailabilityHoursFormForOneDay>
                </div>
            )}
        </div>)
    );
};