import React, { useCallback } from 'react'
import type { DateAvailability } from '../../../interfaces/date'
import TextField from '../../TextField'

interface PatternInfoFormProps {
  className?: string
  numberOfDayPattern: number
  endOfDatePattern: string
  setNumberOfDayPattern: React.Dispatch<React.SetStateAction<number>>
  setEndOfDatePattern: React.Dispatch<React.SetStateAction<string>>
  selectedDays: DateAvailability[]
  dispatchSelectedDays: React.ActionDispatch<[action: import('../../../interfaces/date').DayActions]>,
  selectedGroupNumber: number,

}

export const PatternInfoForm = ({ selectedGroupNumber, selectedDays, dispatchSelectedDays, className, numberOfDayPattern, endOfDatePattern, setNumberOfDayPattern, setEndOfDatePattern }: PatternInfoFormProps) => {
  const applyPattern = useCallback(() => {
    if (endOfDatePattern && selectedDays.length > 0) {
      const selectedDaysOfGroup = selectedDays.filter(day => day.group?.groupNumber === selectedGroupNumber)
      const endDate = new Date(endOfDatePattern)
      const minMaxDays = selectedDaysOfGroup.reduce((acc, day) => {
        acc.min = day.dateMs < acc.min ? day.dateMs : acc.min
        acc.max = day.dateMs > acc.max ? day.dateMs : acc.max
        return acc
      }, { max: selectedDaysOfGroup[0].dateMs, min: selectedDaysOfGroup[0].dateMs })
      const difDays = calculateDifDays(minMaxDays.min, minMaxDays.max)

      let daysToAdd: Date[] = []
      for (let i = 0; i<selectedDaysOfGroup.length; i++) {
        let dateToAdd = new Date(selectedDaysOfGroup[i].dateMs)
        dateToAdd.setDate((dateToAdd.getDate() + numberOfDayPattern + difDays + 1))
        if (dateToAdd > endDate) {
          break
        }
        daysToAdd.push(dateToAdd)
      }
      dispatchSelectedDays({ type: "addEditable", groupNumber: selectedGroupNumber, value: daysToAdd })
    }


  }, [selectedDays, selectedDays, endOfDatePattern, dispatchSelectedDays, numberOfDayPattern, selectedGroupNumber])

  return (

    <div className={className}>
      <div className='flex flex-col gap-2'>
        <TextField
          label="Nombre de jours d'écart du motif:"
          name='nb jours'
          type='number'
          className='text-black'
          required={true}
          onChange={(e) => { setNumberOfDayPattern(parseInt(e.target.value)) }}
          value={numberOfDayPattern}
          placeholder='Entrer un nombre de jours'
        ></TextField>
        <TextField
          label='Date de fin de motif:'
          name='date'
          type='date'
          value={endOfDatePattern}
          className='text-black'
          required={true}
          onChange={(e) => { setEndOfDatePattern(e.target.value) }}
          placeholder='Entrer un nombre de jours'
        ></TextField>

        <button onClick={() => { applyPattern() }} className="btn btn-primary">Appliquer le motif</button>
      </div>
    </div>

  )
}

/**
 * Calculate difference between two days
 * @param startDate 
 * @param endDate 
 * @returns 
 */
function calculateDifDays(startDate: number, endDate: number) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let timeDifference: number = end.getTime() - start.getTime();
  let daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference;
}