import React from 'react'
import TextField from '../../TextField'

interface PatternInfoFormProps{
  className?: string
  numberOfDayPattern: number
  endOfDatePattern: string
  setNumberOfDayPattern: React.Dispatch<React.SetStateAction<number>>
  setEndOfDatePattern: React.Dispatch<React.SetStateAction<string>>
}

export const PatternInfoForm = ({className, numberOfDayPattern, endOfDatePattern, setNumberOfDayPattern, setEndOfDatePattern}: PatternInfoFormProps) => {
  return (
            <div className={className}>
                <div className='flex flex-col gap-2'>
                  <TextField
                  label='Sélectionner un nombre de jours pour appliqué le motif :'
                  name='nb jours'
                  type='number'
                  className='text-black'
                  required={true}
                  onChange={(e)=>{setNumberOfDayPattern(parseInt(e.target.value))}}
                  value={numberOfDayPattern}
                  placeholder='Entrer un nombre de jours'
                  ></TextField>
                                  <TextField
                  label='Sélectionner un nombre de jours pour appliqué le motif:'
                  name='date'
                  type='date'
                  value={endOfDatePattern}
                  className='text-black'
                  required={true}
                  onChange={(e)=>{setEndOfDatePattern(e.target.value)}}
                  placeholder='Entrer un nombre de jours'
                  ></TextField>
                                
                                <button className="btn btn-primary">Appliquer le motif</button>
                </div>
            </div>
    
  )
}
