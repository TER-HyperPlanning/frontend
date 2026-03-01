import type { DateAvailability, DayActions } from '../../../interfaces/date'

export const availabilityReducer = (
  prevState: DateAvailability[],
  action: DayActions,
): DateAvailability[] => {
  switch (action.type) {
    case 'addEditable': {
      const newItems: DateAvailability[] = []
      const prevStateSet = new Set(
        prevState.flatMap((day) =>
          action.groupNumber === day.group?.groupNumber ? [day.dateMs] : [],
        ),
      )
      action.value.forEach((day) => {
        if (!prevStateSet.has(day.getTime())) {
          prevStateSet.add(day.getTime())
          newItems.push({
            dateMs: day.getTime(),
            canModify: true,
            group: {
              groupNumber: action.groupNumber,
            },
          })
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
      const index = prevState.findIndex(
        (day: DateAvailability) => day.dateMs === time,
      )
      if (index === -1) {
        return [
          ...prevState,
          {
            dateMs: time,
            canModify: true,
            group: {
              groupNumber: action.groupNumber,
            },
          },
        ]
      }
      const prevStateCopy = [...prevState]
      prevStateCopy.splice(index, 1)
      return prevStateCopy
    }

    case 'addYearToEditable': {
     const newTab= addEditableBetweenDates(
        new Date(action.value, 0, 1),
        new Date(action.value + 1, 0, 0),
        prevState,
        action.groupNumber,
      )
      return newTab
    }
    case 'addMonthToEditable': {
      const firstOfMonth = new Date(
        action.value.year,
        action.value.month,
        1,
      )
      const lastOfMonth = new Date(
        action.value.year,
        action.value.month + 1,
        0,
      )

     return addEditableBetweenDates(
        firstOfMonth,
        lastOfMonth,
        prevState,
        action.groupNumber,
      )
    }

    default:
      return prevState
  }
}

function addEditableBetweenDates(
  startDate: Date,
  endDate: Date,
  availabilityTab: DateAvailability[],
  groupNumber: number,
) {
  let currentDate = startDate
  const availabilityTabCopy = [...availabilityTab]

  while (currentDate.getTime() <= endDate.getTime()) {
    const objectToAdd = {
      dateMs: currentDate.getTime(),
      canModify: true,
      group: {
        groupNumber: groupNumber,
      },
    }
    const findedIndexOfCurrentDate = availabilityTabCopy.findIndex(
      (day: DateAvailability) =>
        day.dateMs === currentDate.getTime() &&
        groupNumber === day.group?.groupNumber,
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
