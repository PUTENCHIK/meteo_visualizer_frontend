import clsx from 'clsx';
import s from './range-input.module.scss';
import React, { useEffect, useState } from 'react';

interface RangeInputProps {
    startValue: number;
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    onChange?: (value: number, final?: boolean) => void;
}

export const RangeInput = ({
    startValue,
    min,
    max,
    step,
    disabled = false,
    onChange,
}: RangeInputProps) => {
    const [value, setValue] = useState(startValue);
    const [thumbOffset, setThumbOffset] = useState(300);

    useEffect(() => {
        setThumbOffset(((value - min) / (max - min)) * 100);
    }, [value, min, max]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const v = event.target.valueAsNumber;
        setValue(v);
        if (onChange) onChange(v, false);
    };

    return (
        <div className={clsx(s['range-input-wrapper'])}>
            <span className={clsx(s['limit'])}>{min}</span>
            <div className={clsx(s['input-wrapper'])}>
                <input
                    className={clsx(s['range-input'])}
                    type='range'
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    onChange={handleChange}
                />
                <span
                    className={clsx(s['tooltip'], disabled && s['disabled'])}
                    style={{
                        left: `${thumbOffset}%`,
                    }}>
                    {value}
                </span>
            </div>
            <span className={clsx(s['limit'])}>{max}</span>
        </div>
    );
};
