import clsx from 'clsx';
import s from './select.module.scss';
import type { ComponentPropsWithoutRef } from 'react';

type SelectType = number | string;

interface SelectProps<T extends SelectType> extends Omit<
    ComponentPropsWithoutRef<'select'>,
    'value' | 'onChange'
> {
    value?: T;
    options: readonly T[];
    labels?: Partial<Record<T, string>>;
    onChange?: (value: T) => void;
    onBlur?: () => void;
}

export const Select = <T extends SelectType>({
    value,
    options,
    labels,
    onChange,
    onBlur,
    className,
    ...rest
}: SelectProps<T>) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as T);
    };

    return (
        <select
            {...rest}
            className={clsx(s['select'], className)}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}>
            {options.map((item, index) => {
                const label = labels?.[item] ?? item;

                return (
                    <option key={`${index}-${item}`} value={item}>
                        {label}
                    </option>
                );
            })}
        </select>
    );
};
