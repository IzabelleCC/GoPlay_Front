import React from "react";
import { FormControl, Select, CheckIcon, ISelectProps } from "native-base";

interface SelectFieldProps extends ISelectProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export default function SelectField({
    label,
    options,
    value,
    onChange,
    ...rest
}: SelectFieldProps) {
    return (
        <FormControl w="100%">
            <FormControl.Label>{label}</FormControl.Label>
            <Select
                selectedValue={value}
                onValueChange={onChange}
                placeholder="Selecione uma opção"
                minWidth="100%"
                _selectedItem={{
                    bg: "gray.100",
                    endIcon: <CheckIcon size="5" />,
                }}
                {...rest}
            >
                {options.map((opt) => (
                    <Select.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
            </Select>
        </FormControl>
    );
}
