import clsx from 'clsx';
import s from './guid-label.module.scss';
import { useMemo } from 'react';
import { useFocus } from '@hooks/use-focus';

type GuidObject = 'mast' | 'station' | 'undefined';

interface GuidLabelProps {
    value: string;
    objct?: GuidObject;
}

export const GuidLabel = ({ value, objct = 'undefined' }: GuidLabelProps) => {
    const { focusMast, focusStation, focusObject } = useFocus();

    const displayLabel = useMemo(() => {
        const parts = value.split('-');
        return `${parts[0]}`;
    }, [value]);

    const color = displayLabel.slice(0, 6);

    const handleClick = () => {
        switch (objct) {
            case 'mast':
                focusMast(value);
                return;
            case 'station':
                focusStation(value);
                return;
            default:
                focusObject(value);
                return;
        }
    };

    return (
        <div
            className={clsx(s['guid-label'], s[objct])}
            title={value}
            onClick={handleClick}
            style={{
                backgroundColor: `#${color}`,
                color: `contrast-color(#${color})`,
            }}>
            #{displayLabel}
        </div>
    );
};
