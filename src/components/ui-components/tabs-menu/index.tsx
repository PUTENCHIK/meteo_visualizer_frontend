import clsx from 'clsx';
import s from './tabs-menu.module.scss';

interface TabsMenuProps {
    current: string;
    tabs: Record<string, string>;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export const TabsMenu = ({ current, tabs, disabled = false, onChange }: TabsMenuProps) => {
    const handleClick = (value: string, isCurrent: boolean) => {
        if (onChange && !disabled && !isCurrent) onChange(value);
    };

    return (
        <div className={clsx(s['tabs-menu'])}>
            {Object.entries(tabs).map(([value, title]) => {
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
