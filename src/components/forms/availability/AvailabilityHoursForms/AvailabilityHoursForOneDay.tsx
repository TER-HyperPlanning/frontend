import { useEffect, useState } from 'react'
import type { DateAvailability, DayActions, TimeOfAvailabilityWithEmptyString } from '../../../../types/date'
import { AvailabilityHoursFields } from './AvailabilityHoursFields'

type AvailabilityHoursFormProps = {
  dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
  day: DateAvailability
}

export const AvailabilityHoursFormForOneDay = ({ dispatchSelectedDays, day }: AvailabilityHoursFormProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [localTimeOfAvailability, setLocalTimeOfAvailability] = useState<TimeOfAvailabilityWithEmptyString[]>(
    day.timeOfAvailability
  )

  useEffect(() => {
    setLocalTimeOfAvailability(day.timeOfAvailability)
  }, [day.timeOfAvailability])

  function deleteItem() {
    const newTab = [...localTimeOfAvailability]
    newTab.splice(currentPage, 1)
    dispatchSelectedDays({ type: 'setHoursForOneDay', value: newTab, dateMs: day.dateMs })
    setLocalTimeOfAvailability(newTab)
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <AvailabilityHoursFields
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      timeOfAvailability={localTimeOfAvailability}
      onDeleteCurrent={deleteItem}
      onChangeStart={(value) => {
        const newTimeOfAvailability = [...localTimeOfAvailability]
        newTimeOfAvailability[currentPage] = { ...newTimeOfAvailability[currentPage], start: value }
        setLocalTimeOfAvailability(newTimeOfAvailability)
        dispatchSelectedDays({ type: 'setHoursForOneDay', value: newTimeOfAvailability, dateMs: day.dateMs })
      }}
      onChangeEnd={(value) => {
        const newTimeOfAvailability = [...localTimeOfAvailability]
        newTimeOfAvailability[currentPage] = { ...newTimeOfAvailability[currentPage], end: value }
        setLocalTimeOfAvailability(newTimeOfAvailability)
        dispatchSelectedDays({ type: 'setHoursForOneDay', value: newTimeOfAvailability, dateMs: day.dateMs })
      }}
      onAddAvailability={() => {
        const newTimeOfAvailability = [...localTimeOfAvailability, { start: '', end: '' } satisfies TimeOfAvailabilityWithEmptyString]
        setLocalTimeOfAvailability(newTimeOfAvailability)
        dispatchSelectedDays({ type: 'setHoursForOneDay', value: newTimeOfAvailability, dateMs: day.dateMs })
      }}
    />
  )
}
