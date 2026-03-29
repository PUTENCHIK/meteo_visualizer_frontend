import clsx from 'clsx';
import s from './charts-tooltip.module.scss';
import type { TooltipProps } from 'recharts';
import type { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { DeviceMeasurement } from '@utils/complexes';

type ChartsTooltipProps = TooltipProps<ValueType, NameType> & {
    active?: boolean;
    payload?: Payload<ValueType, NameType>[];
    label?: string | number;
};

export const ChartsTooltip = ({ active, payload }: ChartsTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload as DeviceMeasurement;

    return (
        <div className={clsx(s['tooltip'])}>
            <span>{`Время: ${new Date(data.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3,
            })}`}</span>
            <span>{`Значение: ${data.value}`}</span>
        </div>
    );
};
