import React from 'react'
import type { DayActions, TimeOfAvailabilityWithEmptyString } from '../../../interfaces/date'
import TextField from '../../TextField'

interface AvailabilityTypeCheckboxProps {
  partialAvailability: boolean
  availableAllDay: boolean
  setPartialAvailability: React.Dispatch<React.SetStateAction<boolean>>
  setAvailableAllDay: React.Dispatch<React.SetStateAction<boolean>>
  className?:string
  dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
  selectedGroupNumber : number
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
}

export const AvailabilityTypeCheckbox = ({dispatchSelectedDays, selectedGroupNumber,timeOfAvailability, className,partialAvailability, availableAllDay, setPartialAvailability, setAvailableAllDay}: AvailabilityTypeCheckboxProps) => {
  function handleAvailableAllDay(){

    //if availableAllDay is false, it will switch to true so we verify if it false
    //to change availability in case where it true
    if(!availableAllDay){
      dispatchSelectedDays({type:"setHours", groupNumber:selectedGroupNumber, value:[{start:"00:00", end:"23:59"}]})
      
    } else{
      dispatchSelectedDays({type:"setHours", groupNumber:selectedGroupNumber, value:timeOfAvailability})
    }
    setAvailableAllDay((prev) => !prev)
  }
  return (
        <div >
          <div className={className}>
            <div className='relative'>
              <label className="label">
                <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={partialAvailability} onClick={() => {

                   setPartialAvailability((prev) => !prev) }
                   } />
                Disponibilité partiel
              </label>
              {partialAvailability &&
              <div className="w-75 absolute">
                <TextField
                name="number availability days"
                label='Nombre de jours disponible :'
                placeholder='Entrer un nombre de jour'
                className='text-black'
                type='number'
                required={true}
                ></TextField>
              </div>}
            </div>
            <label className="label">
              <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={availableAllDay} onClick={() => { 
                handleAvailableAllDay()
               }} />
              Disponibilité toute la journée
            </label>
          </div>
</div>
)}