import React from 'react'
import TextField from '../../TextField'

interface AvailabilityTypeCheckboxProps {
  partialAvailability: boolean
  availableAllDay: boolean
  setPartialAvailability: React.Dispatch<React.SetStateAction<boolean>>
  setAvailableAllDay: React.Dispatch<React.SetStateAction<boolean>>
  className?:string
}

export const AvailabilityTypeCheckbox = ({className,partialAvailability, availableAllDay, setPartialAvailability, setAvailableAllDay}: AvailabilityTypeCheckboxProps) => {
  return (
        <div >
          <div className={className}>
            <div className='relative'>
              <label className="label">
                <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={partialAvailability} onClick={() => { setPartialAvailability((prev) => !prev) }} />
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
              <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={availableAllDay} onClick={() => { setAvailableAllDay((prev) => !prev) }} />
              Disponibilité toute la journée
            </label>
          </div>
</div>
)}