import clsx from 'clsx';
import s from './timestamp-label.module.scss';
import { formatTimespamp } from '@utils/common';

interface TimestampLabelProps {
    value: string;
}

export const TimestampLabel = ({ value }: TimestampLabelProps) => {
    return <div className={clsx(s['timestamp-label'])}>{formatTimespamp(value)}</div>;
};
