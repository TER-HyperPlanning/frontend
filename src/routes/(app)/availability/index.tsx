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
import { useDeleteAvailability } from '../../../hooks/availability/useDeleteAvailability'
import { useUpdateAvailability } from '../../../hooks/availability/useUpateAvailability'
import { useAvailabilityGroup } from '../../../hooks/availabilityGroup/useAvailabilityGroup'
import { useCreateAvailabilityGroup } from '../../../hooks/availabilityGroup/useCreateAvailabilityGroup'
import { useDeleteAvailabilityGroup } from '../../../hooks/availabilityGroup/useDeleteAvailabilityGroup'
import PageLayout from '../../../layout/PageLayout'
import type { GroupProps, GroupPropsEndPointRes, TimeOfAvailabilityWithEmptyString } from '../../../types/date'
import { availabilityReponseToDateAvailability, dateAvailabilityToAvailabilityReponse, weekDay } from '../../../utils/date.utils'
import { availabilityReducer } from './availabilityReducer'



export const Route = createFileRoute('/(app)/availability/')({
  component: RouteComponent,
})

const id = JSON.parse(localStorage.getItem("currentUser") as any).id


function RouteComponent() {
  const { data: dataAvailability, isFetched: isFetchedAvailability } = useAvailability(id)
  const { mutate: postAvailability } = useCreateAvailability()
  const { mutateAsync: postAvailabilityGroup } = useCreateAvailabilityGroup()
  const { mutate: deleteAvailability } = useDeleteAvailability()
  const { mutate: putAvailability } = useUpdateAvailability()
  const { mutateAsync: deleteAvailabilityGroup } = useDeleteAvailabilityGroup()
  const { data: dataAvailabilityGroup, isFetched: isFetchedAvailabilityGroup } = useAvailabilityGroup(id)
  const [selectedDays, dispatchSelectedDays] = useReducer(availabilityReducer, [])
  const selectedMonth = useRef(new Date().getMonth())
  const selectedYear = useRef(new Date().getFullYear())
  const [availableAllDay, setAvailableAllDay] = useState(true)
  const [selectedGroupNumber, setSelectedGroupNumber] = useState(1);
  const [groups, setGroups] = useState<GroupProps[]>([{ number: 1 }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfDayPattern, setNumberOfDayPattern] = useState(0);
  const [endOfDatePattern, setEndOfDatePattern] = useState("");
  const [isDataSave, setIsDataSave] = useState(false)
  const [isErrorDataSave, setIsErrorDataSave]= useState(false)
  const [timeOfAvailability, setTimeOfAvailability] = useState<TimeOfAvailabilityWithEmptyString[]>([{
    start: "",
    end: "",
  }]);


  useEffect(() => {
    if (isFetchedAvailability && isFetchedAvailabilityGroup) {
      const dicoGroupNumber: Record<string, number> = {}
      const hasNullGroupId = dataAvailability.some((date) => date.availabilityGroupId === null)

      let groupToPut: GroupProps[] = hasNullGroupId ? [{ number: 1 }] : []
      let count = hasNullGroupId ? 2 : 1
      for (let data of dataAvailabilityGroup) {
        dicoGroupNumber[data.id] = count
        groupToPut.push({ number: count, numberOfAvailableDays: data.numberOfAvailableDays })
        count++
      }
      if (groupToPut.length !== 0) {
        setGroups(groupToPut)
      }
      const fetchedDays = availabilityReponseToDateAvailability(dataAvailability, weekDay, dicoGroupNumber)
      dispatchSelectedDays({ type: "addSelected", value: fetchedDays })
    }
  }, [isFetchedAvailability, isFetchedAvailabilityGroup])

  useEffect(() => {
    setTimeout(() => {
      if (isDataSave) {
        setIsDataSave(false)
      }
    }, 3000);
  }, [isDataSave]);

  useEffect(() => {
    setTimeout(() => {
      if (isErrorDataSave) {
        setIsErrorDataSave(false)
      }
    }, 3000);
  }, [isErrorDataSave]);

  const postCurrentAvailability = useCallback(async () => {
    try {
    const availToDelete = []
    for (let availGroup of dataAvailabilityGroup) {
      if (availGroup.teacherId === id) {
        availToDelete.push(deleteAvailabilityGroup(availGroup.id))
      }
    }
    await Promise.all(availToDelete)
    const groupPromises: Promise<GroupPropsEndPointRes>[] = [];
    const keys: number[] = [];
    groups.forEach((group) => {
      if (group.numberOfAvailableDays) {
        keys.push(group.number);
        groupPromises.push(
          postAvailabilityGroup({
            numberOfAvailableDays: group.numberOfAvailableDays,
            teacherId: id,
          })
        );
      }
    });

    // 2. On attend tous les résultats
    const results = await Promise.all(groupPromises);

    // 3. On remplit l'objet final
    const groupConversion: Record<number, GroupPropsEndPointRes> = {};
    keys.forEach((key, index) => {
      groupConversion[key] = results[index];
    });

    const dataToSend = dateAvailabilityToAvailabilityReponse(selectedDays, weekDay, id, groups)
    const findedIndex = new Set<number>()
    const usedId = new Set<string>()
    for (let date of dataToSend) {
      if (date.availabilityGroupId) {
        date.availabilityGroupId = groupConversion[parseInt(date.availabilityGroupId)].id
      }
      const dateStart = new Date(date.startDate.split("T")[0]).getTime()
      const dateEnd = new Date(date.endDate.split("T")[0]).getTime()

      const dateOverlap = dataAvailability.find((avail, i) => {

        const availStart = new Date(avail.startDate.split("T")[0]).getTime()
        const availEnd = new Date(avail.endDate.split("T")[0]).getTime()

        const isDateOverlap = dateStart <= availEnd && dateEnd >= availStart
        const isTimeOverlap = date.startTime <= avail.endTime && date.endTime >= avail.startTime;
        if (isDateOverlap && isTimeOverlap && date.weekDay === avail.weekDay) {
          findedIndex.add(i)
          return true
        }
        return false
      })

      if (!dateOverlap) {
        postAvailability(date)
      } else {
        const isIntervalEqual = date.startTime === dateOverlap.startTime && date.endTime === dateOverlap.endTime && date.startDate === dateOverlap.startDate && date.endDate === dateOverlap.endDate
        if (!isIntervalEqual) {
          if (usedId.has(dateOverlap.id)) {
            postAvailability(date)
          } else {
            putAvailability({
              id: dateOverlap.id,
              data: date
            })
            usedId.add(dateOverlap.id)
          }
        }
      }
    }

    dataAvailability.forEach((data, i) => {
      if (!findedIndex.has(i)) {
        deleteAvailability(data.id)
      }

    })

    setIsDataSave(true)
    } catch (error) {
      console.error(error)
      setIsErrorDataSave(true)
    }
  }, [dataAvailability, selectedDays, groups, dataAvailabilityGroup])


  return (
    false ? <div></div> : (<div>
      <div>
      </div>
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
        <div>
          <div className='flex justify-end mr-5'>
            <button className='btn btn-success' onClick={() => {
              try {
                postCurrentAvailability()
              } catch (error) {
                setIsErrorDataSave(true)
              }
            }}>Sauvegarder</button>

          </div>
          <div className='flex justify-end mr-5'>
            {isDataSave && <div>données sauvegarder</div>}
            {isErrorDataSave && <div>erreur de sauvegarde</div>}
            </div>

        </div>
      </PageLayout>
    </div>)
  )
}
