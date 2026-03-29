import clsx from 'clsx';
import s from './button.module.scss';

type ButtonType = 'tertiary' | 'secondary' | 'primary';

interface ButtonProps {
    title: string;
    type?: ButtonType;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button = ({ title, type = 'secondary', disabled = false, onClick }: ButtonProps) => {
    return (
        <button className={clsx(s['button'], s[type])} disabled={disabled} onClick={onClick}>
            {title}
        </button>
    );
};
