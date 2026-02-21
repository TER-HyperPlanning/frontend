import React from 'react'

interface AvailabilityTypeCheckboxProps {
  partialAvailability: boolean
  availableAllDay: boolean
  setPartialAvailability: React.Dispatch<React.SetStateAction<boolean>>
  setAvailableAllDay: React.Dispatch<React.SetStateAction<boolean>>
}

export const AvailabilityTypeCheckbox = ({partialAvailability, availableAllDay, setPartialAvailability, setAvailableAllDay}: AvailabilityTypeCheckboxProps) => {
  return (
        <div className='flex flex-col'>
          <label className="label">
            <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={partialAvailability} onClick={() => { setPartialAvailability((prev) => !prev) }} />
            Disponibilité partiel
          </label>
          <label className="label">
            <input type="checkbox" className='checkbox checkbox-neutral checkbox-xs' checked={availableAllDay} onClick={() => { setAvailableAllDay((prev) => !prev) }} />
            Disponibilité toute la journée
          </label>
        </div>
  )
}
