import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { AvailabilityCalendar } from '../../../components/availability/AvailabilityCalendar/AvailabilityCalendar'
import { GroupNav } from '../../../components/availability/GroupNav'
import { AvailabilityHoursForm } from '../../../components/forms/availability/AvailabilityHoursForms/AvailabilityHoursForm'
import { AvailabilityTypeCheckbox } from '../../../components/forms/availability/AvailabilityTypeCheckbox'
import { PatternInfoForm } from '../../../components/forms/availability/PatternInfoForm'
import Logo from '../../../components/Logo'
import { useAvailability } from '../../../hooks/availability/useAvailability'
import { useCreateAvailability } from '../../../hooks/availability/useCreateAvailability'
import { useUpdateAvailability } from '../../../hooks/availability/useUpateAvailability'
import { useWeekDay } from '../../../hooks/weekDay/useWeekDay'
import PageLayout from '../../../layout/PageLayout'
import type { GroupProps, TimeOfAvailabilityWithEmptyString } from '../../../types/date'
import { availabilityReponseToDateAvailability, dateAvailabilityToAvailabilityReponse } from '../../../utils/date.utils'
import { availabilityReducer } from './availabilityReducer'



export const Route = createFileRoute('/(app)/availability/')({
  component: RouteComponent,
})

const id = JSON.parse(localStorage.getItem("currentUser") as any).id


function RouteComponent() {
  const { data: dataAvailability, isFetched: isFetchedAvailability } = useAvailability(id)
  const { data: dataWeekDay, isFetched: isFetchedWeekDay } = useWeekDay()
  const { mutate: postAvailability } = useCreateAvailability()
  const { mutate: putAvailability } = useUpdateAvailability()
  const [selectedDays, dispatchSelectedDays] = useReducer(availabilityReducer, [])
  const selectedMonth = useRef(new Date().getMonth())
  const selectedYear = useRef(new Date().getFullYear())
  const [availableAllDay, setAvailableAllDay] = useState(true)
  const [selectedGroupNumber, setSelectedGroupNumber] = useState(1);
  const [groups, setGroups] = useState<GroupProps[]>([{ number: 1 }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfDayPattern, setNumberOfDayPattern] = useState(0);
  const [endOfDatePattern, setEndOfDatePattern] = useState("");
  const [timeOfAvailability, setTimeOfAvailability] = useState<TimeOfAvailabilityWithEmptyString[]>([{
    start: "",
    end: "",
  }]);


  useEffect(() => {
    if (isFetchedAvailability && isFetchedWeekDay) {
      const fetchedDays = availabilityReponseToDateAvailability(dataAvailability, dataWeekDay)
      const b = dateAvailabilityToAvailabilityReponse(a, dataWeekDay, id)
      console.log("convertres", b)
      dispatchSelectedDays({ type: "addSelected", value: fetchedDays })
    }
  }, [isFetchedAvailability, isFetchedWeekDay])

  const postCurrentAvailability = useCallback(() => {
    const dataToSend = dateAvailabilityToAvailabilityReponse(selectedDays, dataWeekDay, id)
    const findedIndex : number[]=[]
    for (let date of dataToSend) {
      const dateOverlap = dataAvailability.find((avail,i) => {
        const isDateOverlap = date.startDate <= avail.endDate && date.endDate >= avail.startDate;
        const isTimeOverlap = date.startTime <= avail.endTime && date.endTime >= avail.startTime;
        if (isDateOverlap && isTimeOverlap){
          findedIndex.push(i)
          return true
        }
        return false
      })

      if (!dateOverlap) {
        postAvailability(date)
      } else {
        const isIntervalEqual = date.startTime === dateOverlap.startTime && date.endTime === dateOverlap.endTime && date.startDate === dateOverlap.startDate && date.endDate === dateOverlap.endDate
        if (!isIntervalEqual) {
          putAvailability({
            id: dateOverlap.id,
            data: date
          }
          )
        }
      }

    }
  }, [])


  return (
    false ? <div></div> : (<div>
      <div onClick={async () => {
        console.log("avail", dataAvailability)
        try {

          const res = postAvailability(
            // id
            {
              "weekDayId": "41005c9e-5360-bb11-50eb-28be4d5446a8", // Remplace "string"
              "startTime": "12:00:00",           // Format string simple
              "endTime": "13:00:00",             // Format string simple
              "startDate": "2026-04-01",
              "endDate": "2026-06-29",
              "teacherId": id
            }
          )
        } catch (error) {

        }

        // console.log(dataWeekDay)


      }}>click</div>
      <PageLayout>
        <div className='flex mt-8 ml-8 justify-between'>
          <Logo showText={true} className="h-8 w-auto text-primary-700" />
          {/* <div>test</div> */}
        </div>

        <div className="m-8">
          <div className="grid grid-cols-3">
            <AvailabilityCalendar
              groups={groups}
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
                selectedDays={selectedDays}
                groups={groups}
                timeOfAvailability={timeOfAvailability}
                availableAllDay={availableAllDay}
                selectedGroupNumber={selectedGroupNumber}
                dispatchSelectedDays={dispatchSelectedDays}
                setGroups={setGroups}
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
      </PageLayout>
    </div>)
  )
}
