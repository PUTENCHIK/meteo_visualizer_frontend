import clsx from 'clsx';
import s from './timestamp-label.module.scss';
import { formatTimespamp } from '@utils/common';

interface TimestampLabelProps {
    value: string;
    deleted?: boolean;
}

export const TimestampLabel = ({ value, deleted = false }: TimestampLabelProps) => {
    return (
        <div className={clsx(s['timestamp-label'], deleted && s['deleted'])}>
            {formatTimespamp(value)}
        </div>
    );
};
