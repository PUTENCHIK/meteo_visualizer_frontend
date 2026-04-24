import clsx from 'clsx';
import s from './loader.module.scss';

interface LoaderProps {
    size?: number;
    withLabel?: boolean;
}

export const Loader = ({ size, withLabel = false }: LoaderProps) => {
    return (
        <div className={clsx(s['loader-box'])}>
            <span
                className={clsx(s['loader'])}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}></span>
            {withLabel && <span className={clsx(s['label'])}>Загрузка</span>}
        </div>
    );
};
