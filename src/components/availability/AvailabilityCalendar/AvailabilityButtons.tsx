import type { ActionDispatch, RefObject } from "react"
import type { DayActions, TimeOfAvailabilityWithEmptyString } from "../../../interfaces/date"

interface AvailabilityButtonsProps {
  dispatchSelectedDays: ActionDispatch<[action: DayActions]>
  selectedMonth: RefObject<number>
  selectedYear: RefObject<number>
  selectedGroupNumber:number
  availableAllDay:boolean
  timeOfAvailability:TimeOfAvailabilityWithEmptyString[]
}

/**
 * 
 * Buttons to modify selected days in component "AvailabilityCalendar"
 * 
 */
export const AvailabilityButtons = ({selectedGroupNumber, availableAllDay, timeOfAvailability, dispatchSelectedDays, selectedMonth, selectedYear} : AvailabilityButtonsProps) => {
  const commonStyle= "btn-sm p-8"
  return (
          <div className='flex-1 w-sm grid grid-cols-2 gap-2'>

                        <button onClick={() => {
              dispatchSelectedDays({
                type: "addMonthToEditable",
                 value: {
                  month: selectedMonth.current,
                  year: selectedYear.current
                },
                availableAllDay:availableAllDay,
                timeOfAvailability:timeOfAvailability,
                groupNumber:selectedGroupNumber
              })
            }} className={`btn btn-success ${commonStyle}`}>
              Ajouter tout les jours du mois
            </button>
            <button onClick={() => { dispatchSelectedDays({
               type: "addYearToEditable",
               value: selectedYear.current,
               groupNumber:selectedGroupNumber,
               availableAllDay:availableAllDay,
               timeOfAvailability:timeOfAvailability
                }) }} className={`btn btn-success ${commonStyle}`}>
              Ajouter tout les jours de l'année
            </button>
                        <button onClick={() => {
              dispatchSelectedDays({
                type: "resetMonth", value: {
                  year: selectedYear.current,
                  month: selectedMonth.current
                },
                groupNumber:selectedGroupNumber
              })
            }} className={`btn btn-error ${commonStyle}`}>
              Retirer tout les jours du mois
            </button>

            <button onClick={() => { dispatchSelectedDays({ type: "resetYear", value: selectedYear.current, groupNumber:selectedGroupNumber }) }} className='btn btn-error btn-sm p-8'>
              Retirer tout les jours de l'année
            </button>

            <button onClick={()=>{
              dispatchSelectedDays({type:"setSelectedToEditable", groupNumber:selectedGroupNumber}
              )}}
             className={`btn btn-blue ${commonStyle}`}>
              Rendre les éléments sélectionner modifiable
            </button>

                        <button onClick={() => { dispatchSelectedDays({ type: "resetEditableOnly",groupNumber:selectedGroupNumber }) }}
              className={`btn btn-blue ${commonStyle}`}
            >
              N'appliquer aucune modification sur tout les jours
            </button>
          </div>
  )
}
