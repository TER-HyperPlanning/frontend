import React from 'react'
import { CurrentMonth } from './CurrentMonth'
import { CurrentYear } from './CurrentYear'

export const CurrentMonthAndYear = () => {
  return (
    <div className='flex'>
        <CurrentMonth></CurrentMonth>
        <CurrentYear></CurrentYear>
    </div>
  )
}
