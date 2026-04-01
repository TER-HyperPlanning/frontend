import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { TimeOfAvailabilityWithEmptyString } from '../../../../interfaces/date'
import { HorizontalTextField } from '../../../HorizontalTextField'
import { ErrorText } from '../../../ErrorText'

type AvailabilityHoursFieldsProps = {
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
  onDeleteCurrent: () => void
  onChangeStart: (value: TimeOfAvailabilityWithEmptyString['start']) => void
  onChangeEnd: (value: TimeOfAvailabilityWithEmptyString['end']) => void
  onAddAvailability: () => void
}

export const AvailabilityHoursFields = ({
  currentPage,
  setCurrentPage,
  timeOfAvailability,
  onDeleteCurrent,
  onChangeStart,
  onChangeEnd,
  onAddAvailability
}: AvailabilityHoursFieldsProps) => {
  function navLeft() {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  function navRight() {
    setCurrentPage((prev) => (prev + 1 < timeOfAvailability.length ? prev + 1 : prev))
  }  function compareTimes(start: string, end: string) {
    if (!start || !end) return true
    const [startHours, startMinutes] = start.split(':').map(Number)
    const [endHours, endMinutes] = end.split(':').map(Number)

    if (startHours > endHours) return false
    if (startHours === endHours && startMinutes >= endMinutes) return false
    return true
  }

  const isTimeValid = compareTimes(timeOfAvailability[currentPage].start, timeOfAvailability[currentPage].end)



  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center items-center gap-8">
          <ArrowLeft onClick={navLeft}></ArrowLeft>
          <div className="flex flex-col items-end gap-4">
            <div>
              <HorizontalTextField
                label="Heure de début :"
                type="time"
                onChange={(e) => {
                  onChangeStart(e.target.value as TimeOfAvailabilityWithEmptyString['start'])
                }}
                value={timeOfAvailability[currentPage].start}
                error={timeOfAvailability[currentPage].start === "" || !isTimeValid}
              ></HorizontalTextField>
              <ErrorText
                error={
                  timeOfAvailability[currentPage].start === "" ? "Veuillez entrer une heure de début" : 
                  isTimeValid ? "" : <div>L'heure de début doit être inférieure <br /> à l'heure de fin</div>
                 }
              />
            </div>
            <HorizontalTextField
              label="Heure de fin :"
              type="time"
              onChange={(e) => {
                onChangeEnd(e.target.value as TimeOfAvailabilityWithEmptyString['end'])
              }}
              error={timeOfAvailability[currentPage].end === ""}
              value={timeOfAvailability[currentPage].end}
            ></HorizontalTextField>
            <div className='w-full'>

              <div className='-mt-4'>
                <ErrorText
                  error={timeOfAvailability[currentPage].end === "" ? "Veuillez entrer une heure de fin" : ""}/>
              </div>
            </div>
          </div>
          {timeOfAvailability.length > 1 && (
            <div
              onClick={onDeleteCurrent}
              className="hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            ><X color='red'></X></div>
          )}
          <ArrowRight onClick={navRight}></ArrowRight>
        </div>
        <div>
          page {currentPage + 1} / {timeOfAvailability.length}
        </div>
        <div className="flex gap-4">
          <button onClick={onAddAvailability} className="btn btn-blue">
            Ajouter une disponibilité
          </button>
        </div>
      </div>
    </div>
  )
}

