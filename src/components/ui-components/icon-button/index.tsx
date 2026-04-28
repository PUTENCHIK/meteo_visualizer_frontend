import clsx from 'clsx';
import s from './icon-button.module.scss';
import { SvgIcon } from '@components/svg-icon';
import type { IconName, IconSize } from '@utils/icons';

type IconButtonType = 'default' | 'secondary' | 'primary';

interface IconButtonStyle {
    className: string;
    iconColor?: string;
}

const typeToStyles: Record<IconButtonType, IconButtonStyle> = {
    default: {
        className: 'default',
    },
    secondary: {
        className: 'secondary',
    },
    primary: {
        className: 'primary',
    },
};

interface IconButtonProps {
    iconName: IconName;
    title: string;
    type?: IconButtonType;
    iconSize?: IconSize;
    iconColor?: string;
    iconRotate?: number;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export const IconButton = ({
    iconName,
    title,
    type = 'default',
    iconSize = 24,
    iconColor,
    iconRotate = 0,
    className,
    disabled = false,
    onClick,
}: IconButtonProps) => {
    return (
        <button
            type='button'
            className={clsx(s['icon-button'], s[typeToStyles[type].className], className)}
            title={title}
            disabled={disabled}
            onClick={onClick}>
            <SvgIcon
                iconName={iconName}
                size={iconSize}
                rotate={iconRotate}
                disabled={disabled}
                color={iconColor ?? typeToStyles[type].iconColor}
            />
        </button>
    );
};
