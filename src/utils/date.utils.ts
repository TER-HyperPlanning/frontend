import type {
  AvailabilityGet,
  AvailabilityPost,
  DateAvailability,
  TimeString,
  WeekDayReponse
} from '../types/date';

export const getInitialDate = () => {
  const d = new Date()
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  else if (d.getDay() === 6) d.setDate(d.getDate() + 2)
  return d
}

export const availabilityReponseToDateAvailability = (
  dateRes: AvailabilityGet[],
  weekDayReponse: WeekDayReponse[],
) => {
  const dateAvailability: DateAvailability[] = []

  for (let res of dateRes) {
    const startDate = new Date(res.startDate)
    const dateId = weekDayReponseToDay(res.weekDay, weekDayReponse)
    const endDate = new Date(res.endDate)

    for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
      if (startDate.getUTCDay() === dateId) {
        //see if the availability was already added
        //and take index if it true
        
        const indexOfDate = dateAvailability.findIndex(
          (date) => new Date(date.dateMs).toDateString() === startDate.toDateString(),
        )
      
        //if the availability was not here, we add it
        if (indexOfDate === -1) {
          dateAvailability.push({
            dateMs: startDate.getTime(),
            canModify: false,
            group: {
              groupNumber: 1,
            },
            timeOfAvailability: [
              {
                start: res.startTime,
                end: res.endTime,
              },
            ],
          })
        } else {
          //if the availability already here, we add only start
          //and end time on the object dateAvailability
          dateAvailability[indexOfDate].timeOfAvailability.push({
            start: res.startTime,
            end: res.endTime,
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
const weekDayReponseToDay = (
  weekDayName: string,
  weekDayReponse: WeekDayReponse[],
) => {
  const selectedDayId = weekDayReponse.find(
    (day) => day.name === weekDayName,
  )!.orderIndex
  return selectedDayId === 7 ? 0 : selectedDayId - 1
}


type AccType = Record<string, { startDate: Date; endDate: Date }>;


export function dateAvailabilityToAvailabilityReponse(
  dateAvailability: DateAvailability[],
  weekDayReponse: WeekDayReponse[],
  teacherId:string
): AvailabilityPost[]
{
  const availabilityReponse: AvailabilityPost[] = []
  const dicoTime=dateAvailability.reduce((acc ,date)=>{
    for (let time of date.timeOfAvailability){
     const key=`${new Date(date.dateMs).getDay()}-${time.start}-${time.end}`
    const dateToInsert= new Date(date.dateMs)

      if(acc[key]===undefined){
        acc[key]={startDate:dateToInsert,endDate:dateToInsert}
      } else if(dateToInsert < acc[key].startDate){
        acc[key].startDate=dateToInsert
      } else if(dateToInsert > acc[key].endDate){
        acc[key].endDate=dateToInsert
      }
    }
    return acc
  },{} as AccType )

  for (let [key,value] of Object.entries(dicoTime)){
    const {weekDayId,startTime,endTime}=getValueWithKey(key, weekDayReponse)
    availabilityReponse.push({
      startTime,
      endTime,
      weekDayId,
      startDate:value.startDate.toLocaleDateString("sv"),
      endDate:value.endDate.toLocaleDateString("sv"),
      teacherId
    })
  }
return availabilityReponse
}

function getValueWithKey(key:string,weekDayReponse: WeekDayReponse[],
){
  const splittedKey= key.split('-')
  const weekDayOrder=parseInt(parseInt(splittedKey[0]) === 0 ? "7" : `${splittedKey[0]}`)
  const weekDayId= weekDayReponse.find(day=>day.orderIndex===weekDayOrder)!.weekdayId
  const startTime=splittedKey[1] as TimeString
  const endTime=splittedKey[2] as TimeString

  return {weekDayId,startTime,endTime}
}