import clsx from 'clsx';
import s from './select.module.scss';

type SelectType = number | string;

interface SelectProps<T extends SelectType> {
    defaultValue?: T;
    options: readonly T[];
    labels?: Partial<Record<T, string>>;
    disabled?: boolean;
    onChange?: (value: T) => void;
}

export const Select = <T extends SelectType>({
    defaultValue,
    options,
    labels,
    disabled,
    onChange,
}: SelectProps<T>) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as T);
    };

    return (
        <select
            className={clsx(s['select'])}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}>
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
