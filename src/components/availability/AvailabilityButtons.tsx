import type { ActionDispatch, RefObject } from "react"
import type { DayActions } from "../../interfaces/date"

interface AvailabilityButtonsProps {
  dispatchSelectedDays: ActionDispatch<[action: DayActions]>
  selectedMonth: RefObject<number>
  selectedYear: RefObject<number>
}

/**
 * 
 * Buttons to modify selected days in component "AvailabilityCalendar"
 * 
 */
export const AvailabilityButtons = ({ dispatchSelectedDays, selectedMonth, selectedYear} : AvailabilityButtonsProps) => {
  return (
          <div className='flex-1 w-sm grid grid-cols-2 gap-2'>
            <button onClick={() => { dispatchSelectedDays({ type: "resetEditableOnly" }) }}
              className='btn btn-info btn-sm'
            >
              N'appliquer aucune modification sur tout les jours
            </button>
            <button onClick={() => { dispatchSelectedDays({ type: "addYearToEditable", value: selectedYear.current }) }} className='btn btn-success btn-sm '>
              Ajouter tout les jours de l'année
            </button>
            <button onClick={() => {
              dispatchSelectedDays({
                type: "addMonthToEditable", value: {
                  month: selectedMonth.current,
                  year: selectedYear.current
                }
              })
            }} className='btn btn-info btn-sm '>
              Ajouter tout les jours du mois
            </button>
            <button onClick={() => { dispatchSelectedDays({ type: "resetYear", value: selectedYear.current }) }} className='btn btn-error btn-sm '>
              Retirer tout les jours de l'année
            </button>
            <button onClick={() => {
              dispatchSelectedDays({
                type: "resetMonth", value: {
                  year: selectedYear.current,
                  month: selectedMonth.current
                }
              })
            }} className='btn btn-warning btn-sm'>
              Retirer tout les jours du mois
            </button>
          </div>
  )
}
