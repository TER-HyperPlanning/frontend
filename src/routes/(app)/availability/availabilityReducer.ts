import type { DateAvailability, DayActions } from "../../../interfaces/date";

export const availabilityReducer = (prevState: DateAvailability[], action: DayActions): DateAvailability[] => {
  switch (action.type) {
    case "addEditable":
      {
        const prevStateCopy = [...prevState]
        const prevStateSet = new Set(prevState.map((day) => day.dateMs));
        action.value.forEach((day) => {
          if (!prevStateSet.has(day.getTime())) {
            prevStateCopy.push({
              dateMs: day.getTime(),
              canModify: true
            });
          }
        }
        )

        return prevStateCopy;
      }

    case "resetEditableOnly":
      { return prevState.map((day) => ({ ...day, canModify: false })) }
    case "removeDays":
      {
        const daysParamSet = new Set(action.value.map((day) => day.getTime()));
        return prevState.filter((day) => !daysParamSet.has(day.dateMs))
      }
    case "resetYear":
      {
        const firstOfYear = new Date(action.value, 0, 1).getTime()
        const lastOfYear = new Date(action.value + 1, 0, 0).getTime()
        return prevState.filter((day) => day.dateMs < firstOfYear || day.dateMs > lastOfYear);

      }

    case "resetMonth": {
      const firstOfMonth = new Date(action.value.year, action.value.month, 1).getTime()
      const lastOfMonth = new Date(action.value.year, action.value.month + 1, 0).getTime()

      return prevState.filter((day) => day.dateMs < firstOfMonth || day.dateMs > lastOfMonth)
    }

    case "setDatesForDayPicker":
      {

        const index = prevState.findIndex((day: DateAvailability) => day.dateMs === action.value.getTime())
        if (index === -1) {
          return [...prevState, { dateMs: action.value.getTime(), canModify: true }]
        }
        const prevStateCopy = [...prevState]
        prevStateCopy.splice(index, 1)
        return prevStateCopy
        // if (action.value.length > prevState.length) {
        //   return [...prevState, { date: action.value[action.value.length - 1], canModify: true }]
        // }
        // else {
        //   const dayParam = new Set(action.value.map((day) => day.getTime()));
        //   return prevState.filter((day) => dayParam.has(day.date.getTime()))
        // }
      }

    case 'addYearToEditable':
      {
        const dates: DateAvailability[] = [];
        const prevStateSet = new Set(prevState.map((day) => day.dateMs));
        let currentDate = new Date(action.value, 0, 1);

        // Tant qu'on est dans la même année
        while (currentDate.getFullYear() === action.value) {
          dates.push({ dateMs: currentDate.getTime(), canModify: true });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      }
    case "addMonthToEditable": {
      const firstOfMonth = new Date(action.value.year, action.value.month, 1).getTime()
      const lastOfMonth = new Date(action.value.year, action.value.month + 1, 0).getTime()

      const datesToAdd: DateAvailability[] = [];
      let currentMonth = new Date(action.value.year, action.value.month, 1);
      while (currentMonth.getTime() >= firstOfMonth && currentMonth.getTime() <= lastOfMonth
      ) {
        datesToAdd.push({ dateMs: currentMonth.getTime(), canModify: true });
        currentMonth.setDate(currentMonth.getDate() + 1);
      }

      const prevStateCopy = [...prevState]

      const prevStateSet = new Set(prevState.map((day) => day.dateMs));
      datesToAdd.forEach((dateToAdd) => {
        if (!prevStateSet.has(dateToAdd.dateMs)) {
          prevStateCopy.push(dateToAdd);
        }
      }
      )
      return prevStateCopy;
    }


    default:
      return prevState;
  }

}