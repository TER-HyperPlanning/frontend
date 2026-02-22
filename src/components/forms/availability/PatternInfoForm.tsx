import React from 'react'
import TextField from '../../TextField'

interface PatternInfoFormProps{
  className?: string
}

export const PatternInfoForm = ({className}: PatternInfoFormProps) => {
  return (
            <div className={className}>
                <div className='flex flex-col gap-2'>
                  <TextField
                  label='Sélectionner un nombre de jours pour appliqué le motif :'
                  name='nb jours'
                  type='number'
                  className='text-black'
                  required={true}
                  placeholder='Entrer un nombre de jours'
                  ></TextField>
                                  <TextField
                  label='Sélectionner un nombre de jours pour appliqué le motif :'
                  name='date'
                  type='date'
                  className='text-black'
                  required={true}
                  placeholder='Entrer un nombre de jours'
                  ></TextField>
                                
                                <button className="btn btn-primary">Appliquer le motif</button>
                </div>
            </div>
    
  )
}
