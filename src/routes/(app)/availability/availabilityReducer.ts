import type {
  DateAvailability,
  DayActions,
  TimeOfAvailability,
  TimeOfAvailabilityWithEmptyString,
} from '../../../types/date'

export const availabilityReducer = (
  prevState: DateAvailability[],
  action: DayActions,
): DateAvailability[] => {
  switch (action.type) {
    case 'addEditable': {
      const newItems: DateAvailability[] = []
      const prevStateSet = new Set(prevState.map((day) => day.dateMs))

      action.value.forEach((day) => {
        const dayTime = day.getTime()
        if (!prevStateSet.has(dayTime)) {
          prevStateSet.add(dayTime)
          newItems.push(
            getAvailabilitiesHours(
              action.availableAllDay,
              action.timeOfAvailability,
              dayTime,
              action.groupNumber,
            ),
          )
        }
      })

      return [...prevState, ...newItems]
    }
    case 'addSelected': {
      const newItems: DateAvailability[] = []
      const prevStateSet = new Set(prevState.map((day) => day.dateMs))

      action.value.forEach((day) => {
        const dayTime = day.dateMs
        if (!prevStateSet.has(dayTime)) {
          prevStateSet.add(dayTime)
          newItems.push(day)
        }
      })

      return [...prevState, ...newItems]
    }

    case 'resetEditableOnly': {
      return prevState.map((day) => {
        if (day.group?.groupNumber === action.groupNumber) {
          return { ...day, canModify: false }
        } else {
          return day
        }
      })
    }
    case 'removeDays': {
      const daysParamSet = new Set(action.value.map((day) => day.getTime()))
      return prevState.filter(
        (day) =>
          !daysParamSet.has(day.dateMs) ||
          action.groupNumber !== day.group?.groupNumber,
      )
    }
    case 'resetYear': {
      const firstOfYear = new Date(action.value, 0, 1).getTime()
      const lastOfYear = new Date(action.value + 1, 0, 0).getTime()
      return prevState.filter(
        (day) =>
          day.dateMs < firstOfYear ||
          day.dateMs > lastOfYear ||
          day.group?.groupNumber !== action.groupNumber,
      )
    }

    case 'resetMonth': {
      const firstOfMonth = new Date(
        action.value.year,
        action.value.month,
        1,
      ).getTime()
      const lastOfMonth = new Date(
        action.value.year,
        action.value.month + 1,
        0,
      ).getTime()

      return prevState.filter(
        (day) =>
          day.dateMs < firstOfMonth ||
          day.dateMs > lastOfMonth ||
          day.group?.groupNumber !== action.groupNumber,
      )
    }

    //remove the day if it exist on state or add it if not exist
    case 'setDatesForDayPicker': {
      const time = action.value.getTime()
      let index: number = -1
      for (let i = 0; i < prevState.length; i++) {
        //if the day in action is in another group, we dont change days
        if (
          prevState[i].dateMs === time &&
          prevState[i].group?.groupNumber !== action.groupNumber
        ) {
          return prevState
        }

        if (
          prevState[i].dateMs === time &&
          prevState[i].group?.groupNumber === action.groupNumber
        ) {
          index = i
        }
      }
      //if the day was not found in the group, we add it
      if (index === -1) {
        return [
          ...prevState,
          getAvailabilitiesHours(
            action.availableAllDay,
            action.timeOfAvailability,
            time,
            action.groupNumber,
          ),
        ]
      }
      //if the day was found in the group, we remove it
      const prevStateCopy = [...prevState]
      prevStateCopy.splice(index, 1)
      return prevStateCopy
    }

    case 'addYearToEditable': {
      const newTab = addEditableBetweenDates(
        new Date(action.value, 0, 1),
        new Date(action.value + 1, 0, 0),
        prevState,
        action.groupNumber,
        action.availableAllDay,
        action.timeOfAvailability,
      )
      return newTab
    }
    case 'addMonthToEditable': {
      const firstOfMonth = new Date(action.value.year, action.value.month, 1)
      const lastOfMonth = new Date(action.value.year, action.value.month + 1, 0)

      return addEditableBetweenDates(
        firstOfMonth,
        lastOfMonth,
        prevState,
        action.groupNumber,
        action.availableAllDay,
        action.timeOfAvailability,
      )
    }

    case 'setHours': {
      return prevState.map((day) => {
        return day.group.groupNumber === action.groupNumber && day.canModify
          ? getAvailabilitiesHours(
              action.availableAllDay,
              action.timeOfAvailability,
              day.dateMs,
              day.group?.groupNumber as number,
            )
          : day
      })
    }

    case 'setHoursForOneDay': {
      return prevState.map((day) => {
        return day.dateMs === action.dateMs
          ? { ...day, timeOfAvailability: action.value }
          : day
      })
    }

    case 'resetGroup':
      return prevState.filter(
        (day) => day.group?.groupNumber !== action.groupNumber,
      )

    case 'setSelectedToEditable':
      return prevState.map((day) =>
        day.group.groupNumber === action.groupNumber
          ? { ...day, canModify: true }
          : day,
      )

    default:
      return prevState
  }
}

function addEditableBetweenDates(
  startDate: Date,
  endDate: Date,
  availabilityTab: DateAvailability[],
  groupNumber: number,
  availableAllDay: boolean,
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[],
) {
  let currentDate = startDate
  const availabilityTabCopy = [...availabilityTab]

  while (currentDate.getTime() <= endDate.getTime()) {
    const currentTime = currentDate.getTime()
    const objectToAdd = getAvailabilitiesHours(
      availableAllDay,
      timeOfAvailability,
      currentTime,
      groupNumber,
    )
    const findedIndexOfCurrentDate = availabilityTabCopy.findIndex(
      (day: DateAvailability) =>
        day.dateMs === currentTime && groupNumber === day.group?.groupNumber,
    )
    if (findedIndexOfCurrentDate === -1) {
      availabilityTabCopy.push(objectToAdd)
    } else {
      availabilityTabCopy[findedIndexOfCurrentDate] = objectToAdd
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return availabilityTabCopy
}

/**
 * if availableAllDay is true, return an availability between
 * 00:00 and 23:59. If it false return the availability with param
 * timeOfAvailability
 * @param availableAllDay 
 * @param timeOfAvailability 
 * @param dateMs 
 * @param groupNumber 
 * @returns 
 */
function getAvailabilitiesHours(
  availableAllDay: boolean,
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[],  
  dateMs: number,
  groupNumber: number,
  canModify: boolean = true
): DateAvailability {
  const dayBase: DateAvailability = {
    dateMs,
    canModify: canModify,
    group: {
      groupNumber,
    },
    timeOfAvailability: [{ start: '', end: '' }],
  }

  if (availableAllDay) {
    return {
      ...dayBase,
      timeOfAvailability: [{ start: '00:00', end: '23:59' }],
    }
  }

  return {
    ...dayBase,
    timeOfAvailability: timeOfAvailability.map((availability) => {
      return { ...availability }
    }) as TimeOfAvailability[],
  }
}
