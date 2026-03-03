import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { DayActions, TimeOfAvailabilityWithEmptyString } from '../../../interfaces/date'
import { HorizontalTextField } from '../../HorizontalTextField'



interface AvailabilityHoursFormProps {
    dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>,
    selectedGroupNumber: number,
    timeOfAvailability: TimeOfAvailabilityWithEmptyString[],
    setTimeOfAvailability: React.Dispatch<React.SetStateAction<TimeOfAvailabilityWithEmptyString[]>>
}





export const AvailabilityHoursForm = ({ timeOfAvailability, setTimeOfAvailability, dispatchSelectedDays, selectedGroupNumber }: AvailabilityHoursFormProps) => {
    const [currentPage, setCurrentPage] = useState(0);


    function navLeft() {
        if (currentPage - 1 >= 0) {
            setCurrentPage(currentPage - 1)
        }

    }

    function navRight() {
        if ((currentPage + 1) < timeOfAvailability.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    function deleteItem() {
        setTimeOfAvailability((prev) => {
            const newTab = [...prev]
            newTab.splice(currentPage, 1)
            return newTab
        })
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
                                const newTab = [...timeOfAvailability]
                                newTab[currentPage].start = e.target.value as any
                                dispatchSelectedDays({ type: "setHours", value: newTab, groupNumber: selectedGroupNumber })
                                setTimeOfAvailability(newTab)
                            }}
                            value={timeOfAvailability[currentPage].start}
                        ></HorizontalTextField>
                        <HorizontalTextField
                            label='Heure de fin'
                            type='time'
                            onChange={(e) => {
                                const newTab = [...timeOfAvailability]
                                newTab[currentPage].end = e.target.value as any
                                dispatchSelectedDays({ type: "setHours", value: newTab, groupNumber: selectedGroupNumber })
                                setTimeOfAvailability(newTab)
                            }}
                            value={timeOfAvailability[currentPage].end}
                        ></HorizontalTextField>
                    </div>
                    {timeOfAvailability.length > 1 &&
                        <div onClick={() => {
                            deleteItem()
                        }} className="hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        >
                            ✕</div>}
                    <ArrowRight onClick={() => { navRight() }}></ArrowRight>
                </div>
                <div>page {currentPage + 1} / {timeOfAvailability.length}</div>
                <div className="flex gap-4">
                    <button onClick={() => {
                        setTimeOfAvailability((prev) => {
                            return [...prev, { start: "", end: "" }]
                        }
                        )
                    }} className='btn btn-primary'>Ajouter une disponibilité</button>
                </div>
            </div>

        </div>

    )
}
