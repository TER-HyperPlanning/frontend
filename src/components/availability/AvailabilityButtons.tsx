import type { ActionDispatch, RefObject } from "react"
import type { DayActions } from "../../interfaces/date"

interface AvailabilityButtonsProps {
  dispatchSelectedDays: ActionDispatch<[action: DayActions]>
  selectedMonth: RefObject<number>
  selectedYear: RefObject<number>
  selectedGroupNumber:number
}

/**
 * 
 * Buttons to modify selected days in component "AvailabilityCalendar"
 * 
 */
export const AvailabilityButtons = ({selectedGroupNumber, dispatchSelectedDays, selectedMonth, selectedYear} : AvailabilityButtonsProps) => {
  return (
          <div className='flex-1 w-sm grid grid-cols-2 gap-2'>
            <button onClick={() => { dispatchSelectedDays({ type: "resetEditableOnly",groupNumber:selectedGroupNumber }) }}
              className='btn btn-info btn-sm p-8'
            >
              N'appliquer aucune modification sur tout les jours
            </button>
            <button onClick={() => { dispatchSelectedDays({
               type: "addYearToEditable",
               value: selectedYear.current,
               groupNumber:selectedGroupNumber
                }) }} className='btn btn-success btn-sm p-8 '>
              Ajouter tout les jours de l'année
            </button>
            <button onClick={() => {
              dispatchSelectedDays({
                type: "addMonthToEditable",
                 value: {
                  month: selectedMonth.current,
                  year: selectedYear.current
                },
                groupNumber:selectedGroupNumber
              })
            }} className='btn btn-info btn-sm p-8 '>
              Ajouter tout les jours du mois
            </button>
            <button onClick={() => { dispatchSelectedDays({ type: "resetYear", value: selectedYear.current, groupNumber:selectedGroupNumber }) }} className='btn btn-error btn-sm p-8'>
              Retirer tout les jours de l'année
            </button>
            <button onClick={() => {
              dispatchSelectedDays({
                type: "resetMonth", value: {
                  year: selectedYear.current,
                  month: selectedMonth.current
                },
                groupNumber:selectedGroupNumber
              })
            }} className='btn btn-warning btn-sm p-8'>
              Retirer tout les jours du mois
            </button>
          </div>
  )
}
