import React, { useEffect, useState } from 'react'
import type { DateAvailability, DayActions, GroupProps, TimeOfAvailabilityWithEmptyString } from '../../../interfaces/date'
import TextField from '../../TextField'

interface AvailabilityTypeCheckboxProps {
  groups: GroupProps[]
  availableAllDay: boolean
  setGroups: React.Dispatch<React.SetStateAction<GroupProps[]>>
  setAvailableAllDay: React.Dispatch<React.SetStateAction<boolean>>
  className?:string
  dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
  selectedGroupNumber : number
  selectedDays: DateAvailability[]
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
}

export const AvailabilityTypeCheckbox = ({dispatchSelectedDays, selectedDays, selectedGroupNumber,timeOfAvailability, className,groups, availableAllDay, setGroups, setAvailableAllDay}: AvailabilityTypeCheckboxProps) => {
  const [partialAvailability, setPartialAvailability] = useState(false);


  function getGroupOfSelectedGroupNumber(){
    const group = groups.find((group)=>{
      return group.number === selectedGroupNumber
    })
    if(!group){
      throw new Error("Group not found")
    }
    return group
  
  }

  useEffect(() => {
    setPartialAvailability(typeof getGroupOfSelectedGroupNumber()?.numberOfDayOfAvailability === "number")
  }, [selectedGroupNumber]);

  function handleOnChangePartialAvailability(e : React.ChangeEvent<HTMLInputElement>){
    const newAvailabilityNumber = parseInt(e.target.value)
    if(newAvailabilityNumber >= 0 || isNaN(newAvailabilityNumber))
    setGroups((prev)=>{return prev.map((group) => {
        if (group.number === selectedGroupNumber) {
          return { ...group, numberOfDayOfAvailability: newAvailabilityNumber }
        }
        return group
      })
    })
    
  }
  function handleAvailableAllDay(){

    //if availableAllDay is false, it will switch to true so we verify if it false
    //to change availability in case where it true
    if(!availableAllDay){
      dispatchSelectedDays({type:"setHours", groupNumber:selectedGroupNumber,availableAllDay:!availableAllDay, timeOfAvailability:[{start:"00:00", end:"23:59"}]})
      
    } else{
      dispatchSelectedDays({type:"setHours", groupNumber:selectedGroupNumber,availableAllDay:!availableAllDay, timeOfAvailability:timeOfAvailability})
    }
    setAvailableAllDay((prev) => !prev)
  }

  function handlePartialAvailabilityCheckBox(){
    //case if partial availability will be false (it will toggle with setter)
    if(partialAvailability){
      setGroups((prev)=>{return prev.map((group) => {
        if (group.number === selectedGroupNumber) {
          const { numberOfDayOfAvailability, ...rest } = group;
          return rest;
        }
        return group
      })
    })
    } else{
      setGroups((prev)=>{return prev.map((group) => {
        if (group.number === selectedGroupNumber) {
          return { ...group, numberOfDayOfAvailability: NaN }
        }
        return group
      })
    })
    }
    setPartialAvailability((prev) => !prev)

  }

  function handlePartialAvailabilityCheckBoxError(){
    const newAvailabilityNumber = getGroupOfSelectedGroupNumber()?.numberOfDayOfAvailability

    const groupLength = selectedDays.filter((day) => day.group.groupNumber === selectedGroupNumber).length 
if(newAvailabilityNumber!==undefined)
    {    if(isNaN(newAvailabilityNumber)){
      return "Veuillez entrer un nombre valide"
    }
    if(newAvailabilityNumber>=groupLength){
      return "Veuillez entrer un nombre de jour inférieur au nombre de jour du groupe"
    }
    if(newAvailabilityNumber<=0){
      return "Veuillez entrer un nombre supérieur à 0"
    }}
    return ""
  }
    
  return (
        <div >
          <div className={className}>
            <div className='relative'>
              <label className="label">
                <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={partialAvailability} onClick={() => {
                  handlePartialAvailabilityCheckBox()
                   }
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
                min={1}
                error={handlePartialAvailabilityCheckBoxError()}
                onChange={(e)=>{handleOnChangePartialAvailability(e)}}
                value={getGroupOfSelectedGroupNumber()?.numberOfDayOfAvailability}
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