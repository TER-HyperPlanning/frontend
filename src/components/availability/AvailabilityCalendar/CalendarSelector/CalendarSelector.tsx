import { useEffect, useState } from "react";
import { DropDown } from "../../../DropDown";

interface CalendarSelectorProps {
    items: string[];
    getCurrentLabel: () => string;
    onSelectionChange: (value: string) => void;
}

export function CalendarSelector({ items, getCurrentLabel, onSelectionChange }: CalendarSelectorProps) {
    const [selectedItem, setSelectedItem] = useState(getCurrentLabel());

    useEffect(() => {
        onSelectionChange(selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        setSelectedItem(getCurrentLabel());
    }, [getCurrentLabel]);

    return (
        <DropDown
            closeOnClick={true}
            items={items}
            setSelectedItems={setSelectedItem}
            label={getCurrentLabel()}
        />
    );
}
