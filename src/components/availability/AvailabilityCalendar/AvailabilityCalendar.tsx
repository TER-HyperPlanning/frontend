import { useEffect, useMemo, useRef, useState, type ActionDispatch, type RefObject } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { twMerge } from "tailwind-merge";
import type { DateAvailability, DayActions, GroupProps, TimeOfAvailabilitySecWithEmptyString } from "../../../types/date";
import { AvailabilityButtons } from "./AvailabilityButtons";
import { CurrentMonthAndYear } from "./CalendarSelector/CurrentMonthAndYear";
import { DayInfoPopUp } from "./DayInfoPopUp";



interface AvailabilityCalendarProps {
    dispatchSelectedDays: ActionDispatch<[action: DayActions]>
    selectedDays: DateAvailability[],
    selectedMonth: RefObject<number>
    selectedYear: RefObject<number>
    className?: string
    groups: GroupProps[]
    calendarClasName?: string
    selectedGroupNumber: number
    timeOfAvailability: TimeOfAvailabilitySecWithEmptyString[]
    availableAllDay: boolean
}

interface StyledDays {

    editable: Date[],
    selectedOnly: Date[],
    selectedOtherGroup: Date[],
    invalidDataEditable: Date[],
    invalidDataOtherGroup: Date[],
    invalidDataSelectedOnly: Date[]

}

export const AvailabilityCalendar = ({ groups, timeOfAvailability, availableAllDay, selectedGroupNumber, calendarClasName, dispatchSelectedDays, selectedDays, selectedMonth, selectedYear, className }: AvailabilityCalendarProps) => {
    const isMouseDown = useRef(false);
    const lockSelectedMode = useRef(false)
    const isModeSelected = useRef(true)
    const calendarRef = useRef<null | HTMLDivElement>(null)
    const hoveredDayWithNoClick = useRef<Date | null>(null)
    const [popUpProps, setPopUpProps] = useState<{ posX: number, posY: number, visible: boolean, day: DateAvailability | null }>({ posX: 0, posY: 0, visible: false, day: null })
    const defaultDayPickerClassName = "place-self-center h-[344px]"
    const defaultClassName = "inline-flex flex-col gap-2"
    const mergedDaysPickerClassName = twMerge(
        defaultDayPickerClassName,
        calendarClasName
    )
    const selectedDaysCopy = useRef(selectedDays)

    useEffect(() => {
        selectedDaysCopy.current = selectedDays
    }, [selectedDays]);

    // follow states of Mouse to see if it pressed or not
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            //only catch left click
            if (e.button === 0) {
                isMouseDown.current = true
                setPopUpProps((prev) => ({ ...prev, visible: false }))
            }
        };
        const handleMouseUp = (e: MouseEvent) => {

            if (e.button === 0) {
                isMouseDown.current = false
                lockSelectedMode.current = false
                isModeSelected.current = true
                hoveredDayWithNoClick.current = null
            }
        };
        const handleRightClick = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const index = selectedDaysCopy.current.findIndex((day) => day.dateMs === hoveredDayWithNoClick.current?.getTime())
            if (index !== -1) {
                setPopUpProps({ posX: e.clientX, posY: e.clientY, day: selectedDaysCopy.current[index], visible: true })
            }
        }
        const calendar = calendarRef.current as HTMLDivElement
        calendar.addEventListener("contextmenu", handleRightClick);


        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            calendar.removeEventListener("contextmenu", handleRightClick);

        };
    }, []);

    const styledDays = useMemo(() => {
        const styledDays = selectedDays.reduce((acc: StyledDays, day) => {
            const hasEmptyHours = day.timeOfAvailability?.some((avail) => avail.start === "" || avail.end === "")
            const selectedGroupLength = selectedDays.filter(d => d.group.groupNumber === day.group.groupNumber).length
            const selectedGroupProps = groups.find(group => group.number === day.group.groupNumber)
            const invalidDate = hasEmptyHours || (selectedGroupProps?.numberOfAvailableDays !== undefined && (isNaN(selectedGroupProps?.numberOfAvailableDays) || selectedGroupProps?.numberOfAvailableDays >= selectedGroupLength || selectedGroupProps?.numberOfAvailableDays <= 0))
            if (day.group.groupNumber !== selectedGroupNumber) {
                //data is invalid if hours are empty. It also invalid if we added a number of availability with empty value or if it greater or equal 
                //than the number of day in that group. if numberOfDayOfAvailability is undefined, it mean we didnt try to enter a value so
                //it's not a partial availability                                                                                                               
                if (invalidDate) {
                    acc.invalidDataOtherGroup.push(new Date(day.dateMs))
                    return acc
                }
                acc.selectedOtherGroup.push(new Date(day.dateMs))
                return acc
            }


            if (day.canModify) {
                if (invalidDate) {
                    acc.invalidDataEditable.push(new Date(day.dateMs))
                    return acc
                }
                acc.editable.push(new Date(day.dateMs))
                return acc
            }

            if (invalidDate) {
                acc.invalidDataSelectedOnly.push(new Date(day.dateMs))
                return acc
            }
            acc.selectedOnly.push(new Date(day.dateMs))
            return acc
        }, {
            editable: [],
            selectedOnly: [],
            invalidDataOtherGroup: [],
            selectedOtherGroup: [],
            invalidDataEditable: [],
            invalidDataSelectedOnly: []
        } satisfies StyledDays)
        return styledDays
    }, [selectedDays, selectedGroupNumber, groups])


    const handleDayMouseEnter = (day: Date) => {


        /*we see if the day the user clicked was selected. 
        If it true th user can drag and maintains the click
        to select multiple days. If it false he can maintains
        he can drag and maintains the click to remove selection
        */
        const indexOfDay = selectedDays.findIndex((d: DateAvailability) => d.dateMs === day.getTime())


        const dayAlreadySelected = indexOfDay !== -1;

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
                dispatchSelectedDays({ type: "addEditable", groupNumber: selectedGroupNumber, timeOfAvailability: timeOfAvailability, availableAllDay: availableAllDay, value: [day, hoveredDayWithNoClick.current] })
            }
            //remove days if the mode to select is disabled
            else if (!isModeSelected.current) {
                dispatchSelectedDays({ type: "removeDays", groupNumber: selectedGroupNumber, value: hoveredDayWithNoClick.current ? [day, hoveredDayWithNoClick.current] : [day] })
            }
        }
    };

    return (
        <div className={className} >
            <div className={defaultClassName}>
                <div ref={calendarRef}>
                    <DayPicker
                        components={{
                            MonthCaption: CurrentMonthAndYear,
                        }}
                        className={mergedDaysPickerClassName}
                        onMonthChange={(date) => {
                            selectedYear.current = date.getFullYear()
                            selectedMonth.current = date.getMonth()
                        }}
                        mode="multiple"
                        locale={fr}
                        onSelect={() => undefined}
                        modifiers={{
                            //modifier for element selected but not editable
                            selectedOnly: styledDays.selectedOnly,
                            //modifier for element selected in another group
                            selectedOtherGroup: styledDays.selectedOtherGroup,
                            emptyHoursOtherGroup: styledDays.invalidDataOtherGroup,
                            emptyHoursEditable: styledDays.invalidDataEditable,
                            emptyHoursSelectedOnly: styledDays.invalidDataSelectedOnly,
                        }
                        }
                        //keep only editable items in selected
                        selected={styledDays.editable}
                        onDayClick={(day) => {
                            dispatchSelectedDays({ type: "setDatesForDayPicker", groupNumber: selectedGroupNumber, value: day, availableAllDay: availableAllDay, timeOfAvailability: timeOfAvailability })
                        }}
                        modifiersClassNames={{
                            selected: "bg-green-400 rounded-2xl",
                            selectedOnly: "bg-green-200 rounded-2xl",
                            selectedOtherGroup: "bg-gray-300 rounded-2xl",
                            emptyHoursEditable: "bg-red-400 rounded-2xl",
                            emptyHoursSelectedOnly: "bg-red-200 rounded-2xl",
                            emptyHoursOtherGroup: "bg-orange-200 rounded-2xl",
                        }}
                        onDayMouseEnter={handleDayMouseEnter}
                    />
                </div>

                <AvailabilityButtons
                    availableAllDay={availableAllDay}
                    timeOfAvailability={timeOfAvailability}
                    selectedGroupNumber={selectedGroupNumber}
                    dispatchSelectedDays={dispatchSelectedDays}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
            </div>
            <DayInfoPopUp
                dispatchSelectedDays={dispatchSelectedDays}
                visible={popUpProps.visible}
                day={popUpProps.day}
                posX={popUpProps.posX}
                posY={popUpProps.posY}></DayInfoPopUp>
        </div>
    );



}


