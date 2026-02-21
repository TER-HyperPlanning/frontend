import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useRef, useState } from 'react'
import { AvailabilityCalendar } from '../../../components/availability/AvailabilityCalendar'
import { GroupNav } from '../../../components/availability/GroupNav'
import { availabilityReducer } from './availabilityReducer'
import { AvailabilityButtons } from '../../../components/availability/AvailabilityButtons'
import { AvailabilityTypeCheckbox } from '../../../components/forms/availability/AvailabilityTypeCheckbox'
import { PatternInfoForm } from '../../../components/forms/availability/PatternInfoForm'
import { AvailabilityHoursForm } from '../../../components/forms/availability/AvailabilityHoursForm'

export const Route = createFileRoute('/(app)/availability/')({
  component: RouteComponent,
})




//0,[0,1] 1,[2,3] 2,[4,5] 3,[6,7] 4
function RouteComponent() {
  const [selectedDays, dispatchSelectedDays] = useReducer(availabilityReducer, [])
  const selectedMonth = useRef(new Date().getMonth())
  const selectedYear = useRef(new Date().getFullYear())
  const [partialAvailability, setPartialAvailability] = useState(false)
  const [availableAllDay, setAvailableAllDay] = useState(true)
  const [selectedGroupNumber, setSelectedGroupNumber] = useState(1);
  const [groups, setGroups] = useState([1]);
  const [currentPage, setCurrentPage] = useState(0);


  return (
    <div>
      <div className='flex justify-around'>
        <div className='flex flex-col'>
          <AvailabilityCalendar className='place-self-center' selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDays={selectedDays} dispatchSelectedDays={dispatchSelectedDays} />
          <AvailabilityButtons selectedMonth={selectedMonth} selectedYear={selectedYear} dispatchSelectedDays={dispatchSelectedDays}></AvailabilityButtons>
        </div>
        <AvailabilityTypeCheckbox partialAvailability={partialAvailability} availableAllDay={availableAllDay} setPartialAvailability={setPartialAvailability} setAvailableAllDay={setAvailableAllDay}></AvailabilityTypeCheckbox>
      <PatternInfoForm/>

      </div>
        <GroupNav selectedGroupNumber={selectedGroupNumber}
        className="flex flex-col items-center gap-4"
         groups={groups}
         currentPage={currentPage}
         setCurrentPage={setCurrentPage}
        setGroups={setGroups}
        setSelectedGroupNumber={setSelectedGroupNumber}/>
    
    <AvailabilityHoursForm></AvailabilityHoursForm>
    </div>
  )

}
