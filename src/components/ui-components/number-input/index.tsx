import clsx from 'clsx';
import s from './number-input.module.scss';
import React, { forwardRef, useEffect, useState, type ComponentPropsWithoutRef } from 'react';

interface NumberInputProps extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'value' | 'defaultValue' | 'onChange'
> {
    value?: number;
    defaultValue?: number;
    postfix?: string;
    decimal?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            value,
            defaultValue = 0,
            className,
            postfix,
            min,
            max,
            maxLength,
            decimal,
            onChange,
            onBlur,
            ...rest
        }: NumberInputProps,
        ref,
    ) => {
        const [inputValue, setInputValue] = useState<string>(
            value?.toString() ?? defaultValue.toString(),
        );

        useEffect(() => {
            if (value !== undefined) {
                const parsedLocal = parseFloat(inputValue);
                if (value !== parsedLocal) {
                    setInputValue(value.toString());
                }
            }
        }, [value]);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            let v = event.target.value.replace(',', '.');

            let isPartial = v === '';
            if (min && Number(min) < 0) {
                isPartial ||= v === '-';
                isPartial ||= v === '-0';
            }
            if (decimal && decimal > 0) {
                isPartial ||= v.endsWith('.');
            }

            if (!isPartial && isNaN(Number(v))) return;

            if (maxLength) {
                let ml = maxLength;
                if (v.replace('-', '').replace('.', '').length > ml) return;
            }

            setInputValue(v);

            let num = parseFloat(v);
            if (!isNaN(num)) {
                onChange?.(num);
            }
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            let num = parseFloat(inputValue);

            if (isNaN(num)) {
                num = value ?? defaultValue;
            } else {
                if (decimal !== undefined) num = Number(num.toFixed(decimal));
                if (min !== undefined) num = Math.max(num, Number(min));
                if (max !== undefined) num = Math.min(num, Number(max));
            }

            setInputValue(num.toString());
            onChange?.(num);
            onBlur?.(event);
        };

        return (
            <div className={clsx(s['number-input-wrapper'])}>
                <input
                    {...rest}
                    type='text'
                    className={clsx(s['number-input'], className)}
                    maxLength={undefined}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={ref}
                />
                {postfix && <span className={clsx(s['postfix'])}>{postfix}</span>}
            </div>
        );
    },
);
