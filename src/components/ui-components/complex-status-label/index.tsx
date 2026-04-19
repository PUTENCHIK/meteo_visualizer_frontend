import clsx from 'clsx';
import s from './complex-status-label.module.scss';

interface ComplexStatusLabelProps {
    isPrivate: boolean;
}

export const ComplexStatusLabel = ({ isPrivate }: ComplexStatusLabelProps) => {
    const label = isPrivate ? 'приватный' : 'публичный';

    return (
        <div className={clsx(s['status-label'], isPrivate ? s['private'] : s['public'])}>
            {label}
        </div>
    );
};
