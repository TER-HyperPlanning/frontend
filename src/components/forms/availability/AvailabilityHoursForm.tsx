import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { HorizontalTextField } from '../../HorizontalTextField'

export const AvailabilityHoursForm = () => {

    return (
        <div>
            <div className='flex flex-col items-center gap-4'>
                <div className='flex justify-center items-center gap-8'>
                    <ArrowLeft></ArrowLeft>
                    <div className='flex flex-col items-end gap-4'>
                        <HorizontalTextField
                            label='Heure de début'
                            type="time"
                        ></HorizontalTextField>
                        <HorizontalTextField
                            label='Heure de fin'
                            type='time'
                        ></HorizontalTextField>
                    </div>
                    <ArrowRight></ArrowRight>
                </div>

                <div className="flex gap-4">
                    <button className='btn btn-primary'>Ajouter une disponibilité</button>
                    <button className='btn btn-success'>Enregistrer les horaires</button>
                </div>
            </div>

        </div>

    )
}
