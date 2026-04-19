import clsx from 'clsx';
import s from './select.module.scss';

type SelectType = number | string;

interface SelectProps<T extends SelectType> {
    value?: T;
    options: readonly T[];
    labels?: Partial<Record<T, string>>;
    name?: string;
    disabled?: boolean;
    onChange?: (value: T) => void;
    onBlur?: () => void;
}

export const Select = <T extends SelectType>({
    value,
    options,
    labels,
    name,
    disabled,
    onChange,
    onBlur,
}: SelectProps<T>) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as T);
    };

    return (
        <select
            className={clsx(s['select'])}
            name={name}
            value={value}
            disabled={disabled}
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
