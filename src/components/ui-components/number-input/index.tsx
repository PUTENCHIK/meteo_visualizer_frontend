import clsx from 'clsx';
import s from './number-input.module.scss';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface NumberInputProps {
    value?: number;
    defaultValue?: number;
    placeholder?: string;
    className?: string;
    postfix?: string;
    min?: number;
    max?: number;
    maxLength?: number;
    step?: number;
    decimal?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    onBlur?: () => void;
}

export interface NumberInputRef {
    update: () => void;
}

export const NumberInput = forwardRef<NumberInputRef, NumberInputProps>(
    (
        {
            value: controlledValue,
            defaultValue = 0,
            placeholder,
            className,
            postfix,
            min,
            max,
            maxLength,
            step,
            decimal,
            disabled = false,
            onChange,
            onBlur,
        }: NumberInputProps,
        ref,
    ) => {
        const [localValue, setLocalValue] = useState(`${controlledValue ?? defaultValue}`);

        useEffect(() => {
            const currentNum = parseFloat(localValue);
            if (controlledValue !== undefined && controlledValue !== currentNum) {
                setLocalValue(controlledValue.toString());
            }
        }, [controlledValue]);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const v = event.target.value.replace(',', '.');
            if (v !== '' && v !== '-' && isNaN(Number(v))) return;
            if (maxLength && v.length > maxLength) return;

            setLocalValue(v);

            const num = parseFloat(v);
            if (!isNaN(num)) {
                onChange?.(num);
            }
        };

        const handleBlur = () => {
            let num = parseFloat(localValue);
            const baseValue = controlledValue ?? defaultValue;

            if (isNaN(num)) {
                setLocalValue(baseValue.toString());
                onChange?.(baseValue);
            } else {
                if (decimal !== undefined && decimal >= 0) num = Number(num.toFixed(decimal));
                if (min !== undefined) num = Math.max(num, min);
                if (max !== undefined) num = Math.min(num, max);

                setLocalValue(num.toString());
                onChange?.(num);
            }

            onBlur?.();
        };

        useImperativeHandle(ref, () => ({
            update: () => {
                setLocalValue(defaultValue.toString());
            },
        }));

        return (
            <div className={clsx(s['number-input-wrapper'])}>
                <input
                    type='text'
                    className={clsx(s['number-input'], className)}
                    value={localValue}
                    placeholder={placeholder}
                    step={step}
                    disabled={disabled}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {postfix && <span className={clsx(s['postfix'])}>{postfix}</span>}
            </div>
        );
    },
);
