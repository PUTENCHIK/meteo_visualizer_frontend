import { ChartsTooltip } from '@components/charts-tooltip';
import { useChartData } from '@context/devices-data-context';
import { useCallback, useDeferredValue } from 'react';
import {
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line,
} from 'recharts';

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
});

interface LineChartProps {
    deviceName: string;
    measure: string;
}

export const LineChart = ({ deviceName, measure }: LineChartProps) => {
    const data = useChartData(deviceName, measure);
    const deferredData = useDeferredValue(data);

    const formatXAxis = useCallback((item: number) => {
        return timeFormatter.format(item);
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: 500,
                boxSizing: 'border-box',
                padding: '10px',
            }}>
            <ResponsiveContainer width='100%' height='100%'>
                <RechartsLineChart data={deferredData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='timestamp' tickFormatter={formatXAxis} minTickGap={30} />
                    <YAxis dataKey='value' domain={['auto', 'auto']} />
                    <Tooltip isAnimationActive={false} content={<ChartsTooltip />} />
                    <Line
                        type='linear'
                        dataKey='value'
                        stroke='#8884d8'
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
};
