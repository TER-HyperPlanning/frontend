import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useRef, useState } from 'react'
import { AvailabilityCalendar } from '../../../components/availability/AvailabilityCalendar'
import { GroupNav } from '../../../components/availability/GroupNav'
import { AvailabilityHoursForm } from '../../../components/forms/availability/AvailabilityHoursForm'
import { AvailabilityTypeCheckbox } from '../../../components/forms/availability/AvailabilityTypeCheckbox'
import { PatternInfoForm } from '../../../components/forms/availability/PatternInfoForm'
import { availabilityReducer } from './availabilityReducer'

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
  const [numberOfDayPattern, setNumberOfDayPattern] = useState(0);
  const [endOfDatePattern, setEndOfDatePattern] = useState("")

  return (
    <div>
      <div className="m-8">
        <div className="grid grid-cols-3">
          <AvailabilityCalendar
            selectedGroupNumber={selectedGroupNumber}
            className='row-span-2'
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDays={selectedDays}
            dispatchSelectedDays={dispatchSelectedDays} />

          <AvailabilityTypeCheckbox className='flex flex-col justify-around h-full '
            partialAvailability={partialAvailability}
            availableAllDay={availableAllDay}
            setPartialAvailability={setPartialAvailability}
            setAvailableAllDay={setAvailableAllDay} />
          <PatternInfoForm
          selectedGroupNumber={selectedGroupNumber}
            selectedDays={selectedDays}
            dispatchSelectedDays={dispatchSelectedDays}
            setEndOfDatePattern={setEndOfDatePattern}
            endOfDatePattern={endOfDatePattern}
            numberOfDayPattern={numberOfDayPattern}
            setNumberOfDayPattern={setNumberOfDayPattern} />

          <GroupNav
            selectedGroupNumber={selectedGroupNumber}
            className='flex justify-around col-span-2 mr-15'
            groups={groups}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setGroups={setGroups}
            setSelectedGroupNumber={setSelectedGroupNumber} />
        </div>
        {!availableAllDay &&
          <AvailabilityHoursForm selectedGroupNumber={selectedGroupNumber} dispatchSelectedDays={dispatchSelectedDays} ></AvailabilityHoursForm>}
      </div>
    </div>
  )
}
