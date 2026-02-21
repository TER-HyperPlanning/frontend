import { useEffect, useRef, type ActionDispatch, type RefObject } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import type { DateAvailability, DayActions } from "../../interfaces/date";


interface AvailabilityCalendarProps {
    dispatchSelectedDays: ActionDispatch<[action: DayActions]>
    selectedDays: DateAvailability[],
    selectedMonth: RefObject<number>
    selectedYear: RefObject<number>
    className?: string
}

export const AvailabilityCalendar = ({ dispatchSelectedDays, selectedDays, selectedMonth, selectedYear, className }: AvailabilityCalendarProps) => {
    const isMouseDown = useRef(false);
    const lockSelectedMode = useRef(false)
    const isModeSelected = useRef(true)
    const hoveredDayWithNoClick = useRef<Date | null>(null)

    // follow states of Mouse to see if it pressed or not
    useEffect(() => {
        const handleMouseDown = () => {
            isMouseDown.current = true
        };
        const handleMouseUp = () => {
            isMouseDown.current = false
            lockSelectedMode.current = false
            isModeSelected.current = true
            hoveredDayWithNoClick.current = null
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleDayMouseEnter = (day: Date) => {

        /*we see if the day the user clicked was selected. 
        If it true th user can drag and maintains the click
        to select multiple days. If it false he can maintains
        he can drag and maintains the click to remove selection
        */
        const dayAlreadySelected = selectedDays.some(
            (d: DateAvailability) => d.dateMs === day.getTime()
        );

        //we save the hovered day because the API dont count
        //the click of the first hovered day.
        if (!isMouseDown.current) {
            hoveredDayWithNoClick.current = day
        } else {
            if (!lockSelectedMode.current) {
                isModeSelected.current = !dayAlreadySelected
                lockSelectedMode.current = true
            }

            //add selected days if use the mode to select
            if (isModeSelected.current && !dayAlreadySelected && hoveredDayWithNoClick.current) {
                dispatchSelectedDays({ type: "addEditable", value: [day, hoveredDayWithNoClick.current] })
            }
            //remove days if the mode to select is disabled
            else if (!isModeSelected.current) {
                dispatchSelectedDays({ type: "removeDays", value: hoveredDayWithNoClick.current ? [day, hoveredDayWithNoClick.current] : [day] })
            }
        }
    };

    return (
        <DayPicker
        startMonth={new Date(2026,0)}
        endMonth={new Date(2026,11)}
        className={className}
            onMonthChange={(date) => {
                selectedYear.current = date.getFullYear()
                selectedMonth.current = date.getMonth()
            }}
            mode="multiple"

            locale={fr}

            onSelect={() => undefined}
            modifiers={{
                // selectedOnly : testMemo.selectedOnlyTab
                selectedOnly: selectedDays.reduce((acc: Date[], day) => {
                    !day.canModify && acc.push(new Date(day.dateMs))
                    return acc
                }, []),
            }
            }

            //keep only modifiable items in selected
            selected={ 
                selectedDays.reduce((acc: Date[], day) => {
                day.canModify && acc.push(new Date(day.dateMs))
                return acc
            }, [])
            }

            onDayClick={(day) => dispatchSelectedDays({ type: "setDatesForDayPicker", value: day })}

            modifiersClassNames={{
                selected: "bg-green-400 rounded-2xl",
                selectedOnly: "bg-green-200 rounded-2xl"
            }}
            onDayMouseEnter={handleDayMouseEnter}
        />
    );

}

