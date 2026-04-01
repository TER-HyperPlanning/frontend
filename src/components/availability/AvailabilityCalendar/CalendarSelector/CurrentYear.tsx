import { useCallback, useMemo } from "react";
import { useDayPicker } from "react-day-picker";
import { CalendarSelector } from "./CalendarSelector";

export const CurrentYear = () => {
    const dayPicker = useDayPicker();

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 11 }, (_, index) => String(currentYear + index));
    }, []);

    const getCurrentYearLabel = useCallback(() => {
        return String(dayPicker.months[0].date.getFullYear());
    }, [dayPicker.months]);

    const handleYearChange = useCallback(
        (selectedYear: string) => {
            const yearValue = Number(selectedYear);
            if (Number.isNaN(yearValue)) {
                throw new Error("Invalid year");
            }
            const currentDate = dayPicker.months[0].date;
            dayPicker.goToMonth(new Date(yearValue, currentDate.getMonth(), 1));
        },
        [dayPicker]
    );

    return (
        <CalendarSelector
            items={availableYears}
            getCurrentLabel={getCurrentYearLabel}
            onSelectionChange={handleYearChange}
        />
    );
};
