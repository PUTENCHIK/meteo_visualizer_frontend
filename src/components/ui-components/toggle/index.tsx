import clsx from 'clsx';
import s from './toggle.module.scss';

interface ToggleProps {
    value: boolean;
    intermediate?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
}

export const Toggle = ({
    value,
    intermediate = false,
    disabled = false,
    onChange,
}: ToggleProps) => {
    const handleClick = () => {
        if (onChange && !disabled) onChange(!value);
    };

    return (
        <button
            type='button'
            className={clsx(s['toggle'], value && s['on'], intermediate && s['intermediate'])}
            disabled={disabled}
            onClick={handleClick}>
            <div className={clsx(s['ball'])}></div>
        </button>
    );
};
