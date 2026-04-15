import clsx from 'clsx';
import s from './loader.module.scss';

interface LoaderProps {
    withLabel?: boolean;
}

export const Loader = ({ withLabel = false }: LoaderProps) => {
    return (
        <div className={clsx(s['loader-box'])}>
            <span className={clsx(s['loader'])}></span>
            {withLabel && <span className={clsx(s['label'])}>Загрузка</span>}
        </div>
    );
};
