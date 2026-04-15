import type {
  AvailabilityGet,
  AvailabilityPost,
  DateAvailability,
  GroupProps,
  TimeString,
  TimeStringSec,
  WeekDayReponse,
} from '../types/date'

export const getInitialDate = () => {
  const d = new Date()
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  else if (d.getDay() === 6) d.setDate(d.getDate() + 2)
  return d
}

export const availabilityReponseToDateAvailability = (
  dateRes: AvailabilityGet[],
  weekDayReponse: WeekDayReponse[],
  dicoGroupNumber: Record<string, number>
) => {
  const dateAvailability: DateAvailability[] = []

  for (let res of dateRes) {
    const startDate = new Date(res.startDate)
    const dateId = weekDayNameToDay(res.weekDay, weekDayReponse)
    const endDate = new Date(res.endDate)
    const availabilityDateLength = 5
    for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
      if (startDate.getUTCDay() === dateId) {
        //see if the availability was already added
        //and take index if it true

        const indexOfDate = dateAvailability.findIndex(
          (date) =>
            new Date(date.dateMs).toDateString() === startDate.toDateString(),
        )
        const startTime = res.startTime.substring(
          0,
          availabilityDateLength,
        ) as TimeString
        const endTime = res.endTime.substring(
          0,
          availabilityDateLength,
        ) as TimeString

        //if the availability was not here, we add it
        if (indexOfDate === -1) {
          dateAvailability.push({
            dateMs: startDate.getTime(),
            canModify: false,
            group: {
              groupNumber: res.availabilityGroupId ? dicoGroupNumber[res.availabilityGroupId] : 1,
            },
            timeOfAvailability: [
              {
                start: startTime,
                end: endTime,
              },
            ],
            
          })
        } else {
          //if the availability already here, we add only start
          //and end time on the object dateAvailability
          dateAvailability[indexOfDate].timeOfAvailability.push({
            start: startTime,
            end: endTime,
          })
        }
      }
    }
  }
  return dateAvailability
}

/**
 * return a number correponding of the day of the Date format of js
 * using the attribute weekday_id of table WeekDay
 * @param weekDayName
 * @param weekDayReponse table WeekDayId
 * @returns
 */
const weekDayNameToDay = (
  weekDayName: string,
  weekDayReponse: WeekDayReponse[],
) => {
 return weekDayReponse.find(
    (day) => day.name === weekDayName,
  )!.orderIndex - 1 

}


type AccType = Record<string, { startDate: Date; endDate: Date }>

export function dateAvailabilityToAvailabilityReponse(
  dateAvailability: DateAvailability[],
  weekDayReponse: WeekDayReponse[],
  teacherId: string,
  groups: GroupProps[]
): AvailabilityPost[] {
  const availabilityReponse: AvailabilityPost[] = []
  const sortedAvail = dateAvailability.sort((a, b) => a.dateMs - b.dateMs)
  const dicoIndexTime: { [key: string]: number } = {}
  const dicoTime = sortedAvail.reduce((acc, date) => {
    for (let time of date.timeOfAvailability) {
      const numberOfAvailableDays = groups.find(
        (group) => group.number === date.group.groupNumber,
      )?.numberOfAvailableDays
      const key = `${new Date(date.dateMs).getDay()}-${time.start}-${time.end}${
        numberOfAvailableDays ? `-${date.group.groupNumber}` : "" 
      }`

      const dateToInsert = new Date(date.dateMs)

      if (dicoIndexTime[key] === undefined) {
        dicoIndexTime[key] = 0
        const indexedKey = `${key}-${dicoIndexTime[key]}`
        acc[indexedKey] = { startDate: dateToInsert, endDate: dateToInsert }
      } else {
        let indexedKey = `${key}-${dicoIndexTime[key]}`
        const difDay = getDifDay(
          new Date(date.dateMs),
          acc[indexedKey].endDate,
        )
        const isDayNextWeek = 7 === difDay
        if (isDayNextWeek) {
          acc[indexedKey].endDate = dateToInsert
        } else {
          dicoIndexTime[key]++
          indexedKey = `${key}-${dicoIndexTime[key]}`
          acc[indexedKey] = { startDate: dateToInsert, endDate: dateToInsert }
        }
      }
    }
    return acc
  }, {} as AccType)

  for (let [key, value] of Object.entries(dicoTime)) {
    const { weekDay, startTime, endTime, groupNumber } = getValueWithKey(
      key,
      weekDayReponse,
    )
    const valueToPush : AvailabilityPost=groupNumber ? {
      startTime,
      endTime,
      weekDay,
      startDate: value.startDate.toLocaleDateString('sv'),
      endDate: value.endDate.toLocaleDateString('sv'),
      teacherId,
      availabilityGroupId: String(groupNumber)
    } : 
     {
      startTime,
      endTime,
      weekDay,
      startDate: value.startDate.toLocaleDateString('sv'),
      endDate: value.endDate.toLocaleDateString('sv'),
      teacherId,
    }
    availabilityReponse.push(valueToPush)
  }
  return availabilityReponse
}

function getDifDay(date1: Date, date2: Date) {
  const conversionMsToDay = 1000 * 60 * 60 * 24
  return Math.round(
    Math.abs((date1.getTime() - date2.getTime() )/ conversionMsToDay),
  )
}

function getValueWithKey(key: string, weekDayReponse: WeekDayReponse[]) {
  const splittedKey = key.split('-')
  const weekDayOrder = parseInt(splittedKey[0])
  const weekDay = weekDayReponse.find(
    (day) => day.orderIndex === weekDayOrder,
  )!.name
  const startTime = `${splittedKey[1]}:00` as TimeStringSec
  const endTime = `${splittedKey[2]}:00` as TimeStringSec
  const groupNumber= splittedKey[3]===undefined ? null : parseInt(splittedKey[3])
  return { weekDay, startTime, endTime, groupNumber }
}


export const weekDay : WeekDayReponse[]=[
  {
    orderIndex: 0,
    name: 'Dimanche'
  },
  {
    orderIndex: 1,
    name: 'Lundi'
  },
  {
    orderIndex: 2,
    name: 'Mardi' 
  },
  {
    orderIndex: 3,
    name: 'Mercredi'
  },
  {
    orderIndex: 4,
    name: 'Jeudi'
  },
  {
    orderIndex: 5,
    name: 'Vendredi'
  },
  {
    orderIndex: 6,
    name: 'Samedi'
  },

]