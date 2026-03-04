import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useRef, useState } from 'react'
import { AvailabilityCalendar } from '../../../components/availability/AvailabilityCalendar'
import { GroupNav } from '../../../components/availability/GroupNav'
import { AvailabilityHoursForm } from '../../../components/forms/availability/AvailabilityHoursForms/AvailabilityHoursForm'
import { AvailabilityTypeCheckbox } from '../../../components/forms/availability/AvailabilityTypeCheckbox'
import { PatternInfoForm } from '../../../components/forms/availability/PatternInfoForm'
import type { TimeOfAvailabilityWithEmptyString } from '../../../interfaces/date'
import { availabilityReducer } from './availabilityReducer'

export const Route = createFileRoute('/(app)/availability/')({
  component: RouteComponent,
})

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
  const [endOfDatePattern, setEndOfDatePattern] = useState("");
  const [timeOfAvailability, setTimeOfAvailability] = useState<TimeOfAvailabilityWithEmptyString[]>([{
    start: "",
    end: "",

  }]);




  return (
    <div>
      <div className="m-8">
        <div className="grid grid-cols-3">
          <AvailabilityCalendar
            timeOfAvailability={timeOfAvailability}
            availableAllDay={availableAllDay}
            selectedGroupNumber={selectedGroupNumber}
            className='row-span-2'
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDays={selectedDays}
            dispatchSelectedDays={dispatchSelectedDays} />

          <div className="flex justify-center">
            <AvailabilityTypeCheckbox className='flex flex-col justify-around  h-full '
              partialAvailability={partialAvailability}
              timeOfAvailability={timeOfAvailability}
              availableAllDay={availableAllDay}
              selectedGroupNumber={selectedGroupNumber}
              dispatchSelectedDays={dispatchSelectedDays}
              setPartialAvailability={setPartialAvailability}
              setAvailableAllDay={setAvailableAllDay} />
          </div>

          <PatternInfoForm
            availableAllDay={availableAllDay}
            timeOfAvailability={timeOfAvailability}
            selectedGroupNumber={selectedGroupNumber}
            selectedDays={selectedDays}
            dispatchSelectedDays={dispatchSelectedDays}
            setEndOfDatePattern={setEndOfDatePattern}
            endOfDatePattern={endOfDatePattern}
            numberOfDayPattern={numberOfDayPattern}
            setNumberOfDayPattern={setNumberOfDayPattern} />


          <div className='grid grid-cols-2 col-span-2 items-baseline'>

            {!availableAllDay &&
              <AvailabilityHoursForm
              availableAllDay={availableAllDay}
                timeOfAvailability={timeOfAvailability}
                setTimeOfAvailability={setTimeOfAvailability}
                selectedGroupNumber={selectedGroupNumber}
                dispatchSelectedDays={dispatchSelectedDays} />
            }
            <GroupNav
              dispatchSelectedDays={dispatchSelectedDays}
              selectedGroupNumber={selectedGroupNumber}
              className='flex justify-around'
              groups={groups}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setGroups={setGroups}
              setSelectedGroupNumber={setSelectedGroupNumber} />
          </div>
        </div>

      </div>
    </div>
  )
}
