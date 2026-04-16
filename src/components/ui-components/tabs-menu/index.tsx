import clsx from 'clsx';
import s from './tabs-menu.module.scss';

interface TabsMenuProps<T extends string> {
    current: T;
    tabs: Record<T, string>;
    disabled?: boolean;
    onChange?: (value: T) => void;
}

export const TabsMenu = <T extends string>({
    current,
    tabs,
    disabled = false,
    onChange,
}: TabsMenuProps<T>) => {
    const handleClick = (value: string, isCurrent: boolean) => {
        if (onChange && !disabled && !isCurrent) onChange(value as T);
    };

    return (
        <div className={clsx(s['tabs-menu'])}>
            {(Object.entries(tabs) as [T, string][]).map(([value, title]) => {
                const isCurrent = value === current;
                return (
                    <button
                        key={value}
                        type='button'
                        className={clsx(s['tab-item'], isCurrent && s['current'])}
                        disabled={disabled}
                        onClick={() => handleClick(value, isCurrent)}>
                        {title}
                    </button>
                );
            })}
        </div>
    );
};
