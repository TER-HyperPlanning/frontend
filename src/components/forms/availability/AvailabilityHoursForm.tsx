import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { DayActions, TimeOfAvailabilityWithVoidString } from '../../../interfaces/date'
import { HorizontalTextField } from '../../HorizontalTextField'



interface AvailabilityHoursFormProps {
    dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>,
    selectedGroupNumber: number
}


export const AvailabilityHoursForm = ({ dispatchSelectedDays, selectedGroupNumber }: AvailabilityHoursFormProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [timeOfAvailability, setTimeOfAvailability] = useState<TimeOfAvailabilityWithVoidString[]>([{
        start: "",
        end: "",

    }]);

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
        if (currentPage > 0) {
            setTimeOfAvailability((prev) => {
                const newTab = [...prev]
                newTab.splice(currentPage, 1)
                return newTab
            })
            navLeft()
        } else{
               setTimeOfAvailability((prev) => {
                const newTab = [...prev]
                newTab.splice(currentPage, 1)
                return newTab
            })
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
                                setTimeOfAvailability((prev) => {
                                    const newTab = [...prev]
                                    newTab[currentPage].start = e.target.value as any
                                    return newTab
                                })
                            }}
                            value={timeOfAvailability[currentPage].start}
                        ></HorizontalTextField>
                        <HorizontalTextField
                            label='Heure de fin'
                            type='time'
                            onChange={(e) => {
                                setTimeOfAvailability((prev) => {
                                    const newTab = [...prev]
                                    newTab[currentPage].end = e.target.value as any
                                    return newTab
                                })
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
                    <button onClick={() => { dispatchSelectedDays({ type: "setHours", value: timeOfAvailability, groupNumber: selectedGroupNumber }) }} className='btn btn-success text-white'>Enregistrer les horaires</button>
                </div>
            </div>

        </div>

    )
}
