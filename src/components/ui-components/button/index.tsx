import clsx from 'clsx';
import s from './button.module.scss';

type ButtonType = 'tertiary' | 'secondary' | 'primary' | 'danger';

type ButtonActionType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    title: string;
    type?: ButtonType;
    actionType?: ButtonActionType;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button = ({
    title,
    type = 'secondary',
    actionType = 'button',
    disabled = false,
    onClick,
}: ButtonProps) => {
    return (
        <button
            type={actionType}
            className={clsx(s['button'], s[type])}
            disabled={disabled}
            onClick={onClick}>
            {title}
        </button>
    );
};
