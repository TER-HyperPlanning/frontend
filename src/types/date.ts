// // prettier-ignore
type Hours =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
// // prettier-ignore
type timeUnit60 =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'
  | '48'
  | '49'
  | '50'
  | '51'
  | '52'
  | '53'
  | '54'
  | '55'
  | '56'
  | '57'
  | '58'
  | '59'

export type TimeString = `${Hours}:${timeUnit60}:${timeUnit60}`

export interface DateAvailability {
  dateMs: number
  canModify: boolean
  group: {
    groupNumber: number
    numberOfDayOfAvailabilities?: number
  }
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
}

export type TimeOfAvailability = {
  start: TimeString
  end: TimeString
}

export type TimeOfAvailabilityWithEmptyString = {
  start: TimeString | ''
  end: TimeString | ''
}

export type DayActions =
  | { type: 'removeDays'; value: Date[]; groupNumber: number }
  | { type: 'resetEditableOnly' | 'resetGroup' | 'setSelectedToEditable'; groupNumber: number }
  | {
      type: 'setDatesForDayPicker'
      value: Date
      groupNumber: number
      availableAllDay: boolean
      timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
    }
  | {
      type: 'resetYear'
      value: number
      groupNumber: number
    }
  | {
      type: 'resetMonth'
      value: { month: number; year: number }
      groupNumber: number
    }
  | {
      type: 'setHours'
      groupNumber: number
      availableAllDay: boolean
      timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
    }
  | {
      type:"addEditable"
      value: Date[]
      groupNumber: number
      availableAllDay: boolean
      timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
    }
  | {
      type:"addSelected"
      value: DateAvailability[]
    }
  | {
      type: 'addYearToEditable'
      value: number
      groupNumber: number
      availableAllDay: boolean
      timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
    }
  | {
      type: 'addMonthToEditable'
      value: { month: number; year: number }
      groupNumber: number
      availableAllDay: boolean
      timeOfAvailability: TimeOfAvailabilityWithEmptyString[]
    }
    | {
      type: 'setHoursForOneDay'
      dateMs: number
      value: TimeOfAvailabilityWithEmptyString[]
    }

    

export interface GroupProps{
  number: number,
  /**
   * if this param is absent, the availability will be
   * complete and not partial. If it NaN, it's an invalid
   * value so user must change it.
   */
  numberOfDayOfAvailability?:number
}


export interface AvailabilityPost {
  weekDayId: string
  startTime: TimeString
  endTime: TimeString
  startDate: string
  endDate: string
  teacherId: string 
}

export type AvailabilityPut = AvailabilityPost

export interface AvailabilityGet {
  id:string
  weekDay: string
  startTime: TimeString
  endTime: TimeString
  startDate: string
  endDate: string
  teacherId: string 
}


export interface WeekDayReponse{
  weekdayId:string,
  orderIndex:number,
  name: string
}

