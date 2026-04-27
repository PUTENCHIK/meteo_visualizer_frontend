import clsx from 'clsx';
import s from './button.module.scss';
import { Link } from 'react-router-dom';

type ButtonType = 'tertiary' | 'secondary' | 'primary' | 'danger';

type ButtonActionType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    title: string;
    type?: ButtonType;
    actionType?: ButtonActionType;
    href?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button = ({
    title,
    type = 'secondary',
    actionType = 'button',
    href,
    disabled = false,
    onClick,
}: ButtonProps) => {
    if (href && !disabled) {
        return (
            <Link to={href} className={clsx(s['button'], s[type], 'link-reset')}>
                {title}
            </Link>
        );
    }

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
