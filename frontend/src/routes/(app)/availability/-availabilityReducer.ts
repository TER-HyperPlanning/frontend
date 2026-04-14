import type {
  DateAvailability,
  DayActions,
  TimeOfAvailability,
  TimeOfAvailabilityWithEmptyString,
} from '../../../interfaces/date'

export const availabilityReducer = (
  prevState: DateAvailability[],
  action: DayActions,
): DateAvailability[] => {
  switch (action.type) {
    case 'addEditable': {
      const newItems: DateAvailability[] = []
      const prevStateSet = new Set(prevState.map(day => day.dateMs))

      action.value.forEach(day => {
        const dayTime = day.getTime()
        if (!prevStateSet.has(dayTime)) {
          prevStateSet.add(dayTime)
          newItems.push(
            getDayWithHours(
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

    case 'resetEditableOnly': {
      return prevState.map(day => {
        if (day.group?.groupNumber === action.groupNumber) {
          return { ...day, canModify: false }
        }

        return day
      })
    }

    case 'removeDays': {
      const daysParamSet = new Set(action.value.map(day => day.getTime()))
      return prevState.filter(
        day => !daysParamSet.has(day.dateMs) || action.groupNumber !== day.group?.groupNumber,
      )
    }

    case 'resetYear': {
      const firstOfYear = new Date(action.value, 0, 1).getTime()
      const lastOfYear = new Date(action.value + 1, 0, 0).getTime()
      return prevState.filter(
        day =>
          day.dateMs < firstOfYear || day.dateMs > lastOfYear || day.group?.groupNumber !== action.groupNumber,
      )
    }

    case 'resetMonth': {
      const firstOfMonth = new Date(action.value.year, action.value.month, 1).getTime()
      const lastOfMonth = new Date(action.value.year, action.value.month + 1, 0).getTime()

      return prevState.filter(
        day =>
          day.dateMs < firstOfMonth || day.dateMs > lastOfMonth || day.group?.groupNumber !== action.groupNumber,
      )
    }

    case 'setDatesForDayPicker': {
      const time = action.value.getTime()
      let index = -1

      for (let i = 0; i < prevState.length; i++) {
        if (prevState[i].dateMs === time && prevState[i].group?.groupNumber !== action.groupNumber) {
          return prevState
        }

        if (prevState[i].dateMs === time && prevState[i].group?.groupNumber === action.groupNumber) {
          index = i
        }
      }

      if (index === -1) {
        return [
          ...prevState,
          getDayWithHours(
            action.availableAllDay,
            action.timeOfAvailability,
            time,
            action.groupNumber,
          ),
        ]
      }

      const prevStateCopy = [...prevState]
      prevStateCopy.splice(index, 1)
      return prevStateCopy
    }

    case 'addYearToEditable': {
      return addEditableBetweenDates(
        new Date(action.value, 0, 1),
        new Date(action.value + 1, 0, 0),
        prevState,
        action.groupNumber,
        action.availableAllDay,
        action.timeOfAvailability,
      )
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
      return prevState.map(day =>
        day.group.groupNumber === action.groupNumber && day.canModify
          ? getDayWithHours(
              action.availableAllDay,
              action.timeOfAvailability,
              day.dateMs,
              day.group?.groupNumber as number,
            )
          : day,
      )
    }

    case 'setHoursForOneDay':
      return prevState.map(day =>
        day.dateMs === action.dateMs ? { ...day, timeOfAvailability: action.value } : day,
      )

    case 'resetGroup':
      return prevState.filter(day => day.group?.groupNumber !== action.groupNumber)

    case 'setSelectedToEditable':
      return prevState.map(day =>
        day.group.groupNumber === action.groupNumber ? { ...day, canModify: true } : day,
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
    const objectToAdd = getDayWithHours(
      availableAllDay,
      timeOfAvailability,
      currentTime,
      groupNumber,
    )
    const findedIndexOfCurrentDate = availabilityTabCopy.findIndex(
      day => day.dateMs === currentTime && groupNumber === day.group?.groupNumber,
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

function getDayWithHours(
  availableAllDay: boolean,
  timeOfAvailability: TimeOfAvailabilityWithEmptyString[],
  dateMs: number,
  groupNumber: number,
): DateAvailability {
  const dayBase: DateAvailability = {
    dateMs,
    canModify: true,
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
    timeOfAvailability: timeOfAvailability.map(availability => {
      return { ...availability }
    }) as TimeOfAvailability[],
  }
}