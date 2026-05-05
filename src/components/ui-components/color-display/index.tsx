import clsx from 'clsx';
import s from './color-display.module.scss';

interface ColorDisplayProps {
    color: string;
    size?: number;
}

export const ColorDisplay = ({ color, size = 32 }: ColorDisplayProps) => {
    return (
        <div
            className={clsx(s['color-display'])}
            style={{
                backgroundColor: color,
                width: `${size}px`,
            }}
            title={color}></div>
    );
};
