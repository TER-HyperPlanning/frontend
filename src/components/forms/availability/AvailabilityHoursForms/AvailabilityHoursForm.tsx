import { useState } from 'react'
import type { DayActions, TimeOfAvailabilityWithEmptyString } from '../../../../types/date'
import { AvailabilityHoursFields } from './AvailabilityHoursFields'

type AvailabilityHoursFormProps = {
  dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
  selectedGroupNumber: number
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
  setTimeOfAvailability: React.Dispatch<React.SetStateAction<TimeOfAvailabilityWithEmptyString[]>>
  availableAllDay: boolean
}

export const AvailabilityHoursForm = (props: AvailabilityHoursFormProps) => {
  const [currentPage, setCurrentPage] = useState(0)

  function deleteItem() {
    props.setTimeOfAvailability((prev) => {
      const newTab = [...prev]
      newTab.splice(currentPage, 1)
      return newTab
    })
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <AvailabilityHoursFields
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      timeOfAvailability={props.timeOfAvailability}
      onDeleteCurrent={deleteItem}
      onChangeStart={(value) => {
        const newTab = [...props.timeOfAvailability]
        newTab[currentPage].start = value
        props.dispatchSelectedDays({
          type: 'setHours',
          timeOfAvailability: newTab,
          availableAllDay: props.availableAllDay,
          groupNumber: props.selectedGroupNumber
        })
        props.setTimeOfAvailability(newTab)
      }}
      onChangeEnd={(value) => {
        const newTab = [...props.timeOfAvailability]
        newTab[currentPage].end = value
        props.dispatchSelectedDays({
          type: 'setHours',
          timeOfAvailability: newTab,
          availableAllDay: props.availableAllDay,
          groupNumber: props.selectedGroupNumber
        })
        props.setTimeOfAvailability(newTab)
      }}
      onAddAvailability={() => {
        props.setTimeOfAvailability((prev) => [...prev, { start: '', end: '' }])
      }}
    />
  )
}
