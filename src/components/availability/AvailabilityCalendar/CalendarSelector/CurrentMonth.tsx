import { useCallback } from "react";
import { useDayPicker } from "react-day-picker";
import { CalendarSelector } from "./CalendarSelector";

interface MonthProps {
    displayedLabel: string,
    monthValue: number
}

export function CurrentMonth() {
    const dayPicker = useDayPicker();
    const getCurrentMonthLabel = useCallback(() => {
        const monthName = allMonths.find(
            (month) => month.monthValue === dayPicker.months[0].date.getMonth()
        )?.displayedLabel;
        if (monthName === undefined) {
            throw new Error("Month not found");
        }
        return monthName;
    }, [dayPicker.months]);

    const handleMonthChange = useCallback(
        (selectedLabel: string) => {
            const monthValue = allMonths.find((month) => month.displayedLabel === selectedLabel)?.monthValue;
            if (monthValue === undefined) {
                throw new Error("Month not found");
            }
            const currentDate = dayPicker.months[0].date;
            dayPicker.goToMonth(new Date(currentDate.getFullYear(), monthValue, 1));
        },
        [dayPicker]
    );

    return (
        <CalendarSelector
            items={allMonths.map((month) => month.displayedLabel)}
            getCurrentLabel={getCurrentMonthLabel}
            onSelectionChange={handleMonthChange}
        />
    );
}





const allMonths: MonthProps[] = [
    {
        displayedLabel: "Janvier",
        monthValue: 0
    },
    {
        displayedLabel: "Février",
        monthValue: 1
    },
    {
        displayedLabel: "Mars",
        monthValue: 2
    },
    {
        displayedLabel: "Avril",
        monthValue: 3
    },
    {
        displayedLabel: "Mai",
        monthValue: 4
    },
    {
        displayedLabel: "Juin",
        monthValue: 5
    },
    {
        displayedLabel: "Juillet",
        monthValue: 6
    },
    {
        displayedLabel: "Août",
        monthValue: 7
    },
    {
        displayedLabel: "Septembre",
        monthValue: 8
    },
    {
        displayedLabel: "Octobre",
        monthValue: 9
    },
    {
        displayedLabel: "Novembre",
        monthValue: 10
    },
    {
        displayedLabel: "Décembre",
        monthValue: 11
    }

]
