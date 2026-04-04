import clsx from 'clsx';
import s from './toggle.module.scss';

interface ToggleProps {
    value: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
}

export const Toggle = ({ value, onChange, disabled = false }: ToggleProps) => {
    const handleClick = () => {
        if (onChange && !disabled) onChange(!value);
    };

    return (
        <button
            type='button'
            className={clsx(s['toggle'], value ? s['on'] : s['off'])}
            disabled={disabled}
            onClick={handleClick}>
            <div className={clsx(s['ball'])}></div>
        </button>
    );
};
