import clsx from 'clsx';
import s from './svg-icon.module.scss';
import { type IconName, type IconSize, iconFiles, sizesToStrokes } from '@utils/icons';

interface SvgIconProps {
    iconName: IconName;
    size: IconSize;
    rotate?: number;
    strokeWidth?: number;
    color?: string;
    primary?: boolean;
    disabled?: boolean;
}

export const SvgIcon = ({
    iconName,
    size,
    rotate = 0,
    strokeWidth,
    color,
    primary = false,
    disabled = false,
}: SvgIconProps) => {
    const SvgIcon = iconFiles[iconName];

    return (
        <SvgIcon
            className={clsx(
                s['svg-icon'],
                color && s['custom-color'],
                primary && !color && s['primary'],
                disabled && !color && s['disabled'],
            )}
            width={size}
            height={size}
            strokeWidth={strokeWidth ?? sizesToStrokes[size]}
            color={color}
            style={{
                rotate: `${rotate}deg`,
            }}
        />
    );
};
