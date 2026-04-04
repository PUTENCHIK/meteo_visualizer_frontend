import { ChartsTooltip } from '@components/charts-tooltip';
import { useDevicesStore } from '@context/devices-context';
import { useCallback, useEffect, useState } from 'react';
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
    const store = useDevicesStore();
    const [data, setData] = useState(() => store.getChartData(deviceName, measure));

    useEffect(() => {
        const currentData = store.getChartData(deviceName, measure);
        setData([...currentData]);

        const unsubscribe = store.subscribe(() => {
            const newData = store.getChartData(deviceName, measure);
            setData([...newData]);
        });

        return () => {
            unsubscribe();
        };
    }, [store, deviceName, measure]);

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
                <RechartsLineChart key={`${deviceName}-${measure}`} data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='timestamp' tickFormatter={formatXAxis} minTickGap={30} />
                    <YAxis dataKey='value' domain={['auto', 'auto']} />
                    <Tooltip isAnimationActive={false} content={<ChartsTooltip />} />
                    <Line
                        type='linear'
                        dataKey='value'
                        stroke='#8884d8'
                        dot={false}
                        isAnimationActive={false}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
};
