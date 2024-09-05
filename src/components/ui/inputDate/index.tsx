import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface InputDateProps {
    text: string;
    className?: string;
    selectedDate?: Date | null;
    onChange?: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
}

const InputDate: React.FC<InputDateProps> = ({
    text,
    className = "",
    selectedDate,
    onChange,
    minDate,
    maxDate,
}) => {
    return (
        <div className="w-full">
            <label className="flex flex-col w-full gap-2">
                <span className="font-bold">{text}</span>
                <DatePicker
                    selected={selectedDate || undefined} // Garante que seja `undefined` se for `null`
                    onChange={onChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dia/mês/ano"
                    className={`w-full p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 border-neutral-200 placeholder:text-neutral-500 ${className}`}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </label>
        </div>
    );
}

export default InputDate;
