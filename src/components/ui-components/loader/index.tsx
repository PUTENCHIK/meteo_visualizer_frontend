import clsx from 'clsx';
import s from './loader.module.scss';
import { useMemo } from 'react';

interface LoaderProps {
    size?: number;
    withLabel?: boolean;
}

export const Loader = ({ size = 64, withLabel = false }: LoaderProps) => {
    const wrapperSize = useMemo(() => (size ? (2 * size) / Math.sqrt(2) : undefined), [size]);

    return (
        <div className={clsx(s['loader-box'])}>
            <div
                className={clsx(s['loader-wrapper'])}
                style={{
                    width: `${wrapperSize}px`,
                    height: `${wrapperSize}px`,
                }}>
                <span
                    className={clsx(s['loader'])}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}></span>
            </div>
            {withLabel && <span className={clsx(s['label'])}>Загрузка</span>}
        </div>
    );
};
