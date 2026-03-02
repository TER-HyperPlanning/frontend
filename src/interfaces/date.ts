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
type Minutes =
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

export type TimeString = `${Hours}:${Minutes}`

export interface DateAvailability {
  dateMs: number
  canModify: boolean
  group: {
    groupNumber: number
    numberOfDayOfAvailabilities?: number
  }
  timeOfAvailability?: TimeOfAvailability[]
}

export type TimeOfAvailability = {
  start: TimeString
  end: TimeString 
}


export type TimeOfAvailabilityWithEmptyString = {
  start: TimeString | ""
  end: TimeString | ""
}



export type DayActions =
  | { type: 'addEditable' | 'removeDays'; value: Date[]; groupNumber: number }
  | { type: 'resetEditableOnly' | 'resetGroup'; groupNumber: number }
  | { type: 'setDatesForDayPicker'; value: Date; groupNumber: number }
  | {
      type: 'addYearToEditable' | 'resetYear'
      value: number
      groupNumber: number
    }
  | {
      type: 'addMonthToEditable' | 'resetMonth'
      value: { month: number; year: number }
      groupNumber: number
    }
  |{
    type : "setHours",
    groupNumber: number,
    emptyTimeCallBack? : () => void,
    value: TimeOfAvailabilityWithEmptyString[]
  }


// type: "setDatesForDayPicker" | "addModifiable" | "resetModifiableOnly" | "resetAll" | "removeDays",
// value: Date[],
