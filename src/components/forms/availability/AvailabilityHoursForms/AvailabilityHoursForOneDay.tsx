import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateAvailability, DayActions, TimeOfAvailabilityWithEmptyString } from '../../../../interfaces/date'
import { HorizontalTextField } from '../../../HorizontalTextField'



type AvailabilityHoursFormProps =
    |
    {
        dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>,
        day: DateAvailability
    }






export const AvailabilityHoursFormForOneDay = ({ dispatchSelectedDays, day }: AvailabilityHoursFormProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [localTimeOfAvailability, setLocalTimeOfAvailability] = useState<TimeOfAvailabilityWithEmptyString[]>(day.timeOfAvailability);

    // Update local state if the day prop changes (e.g. from another component)
    useEffect(() => {
        setLocalTimeOfAvailability(day.timeOfAvailability);
    }, [day.timeOfAvailability]);

    function navLeft() {
        if (currentPage - 1 >= 0) {
            setCurrentPage(currentPage - 1)
        }

    }

    function navRight() {
        if ((currentPage + 1) < localTimeOfAvailability.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    function deleteItem() {
        const newTab = [...localTimeOfAvailability]
        newTab.splice(currentPage, 1)
        dispatchSelectedDays({ type: "setHoursForOneDay", value: newTab, dateMs: day.dateMs })
        setLocalTimeOfAvailability(newTab)
        if (currentPage > 0) {
            navLeft()
        }

    }

    return (
        <div>
            <div className='flex flex-col items-center gap-4'>
                <div className='flex justify-center items-center gap-8'>
                    <ArrowLeft onClick={() => { navLeft() }}></ArrowLeft>
                    <div className='flex flex-col items-end gap-4'>
                        <HorizontalTextField
                            label='Heure de début'
                            type="time"
                            onChange={(e) => {
                                const newTimeOfAvailability = [...localTimeOfAvailability]
                                newTimeOfAvailability[currentPage] = { ...newTimeOfAvailability[currentPage], start: e.target.value as any }
                                setLocalTimeOfAvailability(newTimeOfAvailability)
                                dispatchSelectedDays({ type: "setHoursForOneDay", value: newTimeOfAvailability, dateMs: day.dateMs })
                            }}
                            value={localTimeOfAvailability[currentPage].start}
                        ></HorizontalTextField>
                        <HorizontalTextField
                            label='Heure de fin'
                            type='time'
                            onChange={(e) => {
                                const newTimeOfAvailability = [...localTimeOfAvailability]
                                newTimeOfAvailability[currentPage] = { ...newTimeOfAvailability[currentPage], end: e.target.value as any }
                                setLocalTimeOfAvailability(newTimeOfAvailability)
                                dispatchSelectedDays({ type: "setHoursForOneDay", value: newTimeOfAvailability, dateMs: day.dateMs })
                            }}
                            value={localTimeOfAvailability[currentPage].end}
                        ></HorizontalTextField>
                    </div>
                    {localTimeOfAvailability.length > 1 &&
                        <div onClick={() => {
                            deleteItem()
                        }} className="hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        >
                            ✕</div>}
                    <ArrowRight onClick={() => { navRight() }}></ArrowRight>
                </div>
                <div>page {currentPage + 1} / {localTimeOfAvailability.length}</div>
                <div className="flex gap-4">
                    <button onClick={() => {
                        const newTimeOfAvailability = [...localTimeOfAvailability, { start: "", end: "" } satisfies TimeOfAvailabilityWithEmptyString]
                        setLocalTimeOfAvailability(newTimeOfAvailability)
                        dispatchSelectedDays({ type: "setHoursForOneDay", value: newTimeOfAvailability, dateMs: day.dateMs })
                    }} className='btn btn-primary'>Ajouter une disponibilité</button>
                </div>
            </div>

        </div>

    )
}
