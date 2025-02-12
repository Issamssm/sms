"use client"

import { useMemo } from "react"
import { SingleValue } from "react-select"
import CreateableSelect from "react-select/creatable"

type Props = {
    onChange: (value?: string | null) => void;
    onCreate?: (value: string, dashboardId: string) => void;
    options?: { label: string, value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
    dashboardId: string;
};

export const Select = ({
    onChange,
    onCreate,
    options = [],
    value,
    disabled,
    placeholder,
    dashboardId
}: Props) => {

    const onSelect = (
        option: SingleValue<{ label: string, value: string }> | null
    ) => {
        onChange(option ? option.value : null);
    };

    const formatedValue = useMemo(() => {
        return options.find((option) => option.value === value) || null; // رجّع null بدل undefined
    }, [options, value]);


    const handleCreate = (inputValue: string) => {
        if (onCreate) {
            onCreate(inputValue, dashboardId);
        }
    };

    return (
        <CreateableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": {
                        borderColor: "#e2e8f0",
                    }
                })
            }}
            value={formatedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={handleCreate}
            isDisabled={disabled}
            isClearable
        />
    );
};
