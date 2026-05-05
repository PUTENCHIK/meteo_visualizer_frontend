import { useEffect, useRef, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import { devicesStore } from '@stores/devices-store';
import type { Guid } from 'typescript-guid';

interface LineChartProps {
    measure: MeasureWithDependentsSchema;
    mastId: Guid;
    stationId: Guid;
    deviceId: string;
}

export const LineChart = ({ measure, mastId, stationId, deviceId }: LineChartProps) => {
    const chartRef = useRef<ReactECharts>(null);

    const options = useMemo(
        () => ({
            animation: false,
            grid: { top: 10, right: 10, bottom: 10, left: 10 },
            tooltip: {
                trigger: 'axis',
                animation: false,
                valueFormatter: (value: number) => `${value.toFixed(2)} ${measure.units}`,
            },
            xAxis: {
                type: 'time',
                splitLine: { show: false },
                axisLabel: {
                    formatter: (value: number) =>
                        new Intl.DateTimeFormat('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }).format(value),
                },
                hideOverlap: true,
            },
            yAxis: {
                type: 'value',
                min: measure.min,
                max: measure.max,
                scale: false,
                axisLabel: {
                    formatter: (value: number) => `${value}${measure.units}`,
                },
                splitLine: { lineStyle: { type: 'dashed' } },
            },
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: [],
                    lineStyle: { color: '#8884d8', width: 1 },
                    sampling: 'lttb',
                },
            ],
        }),
        [measure],
    );

    useEffect(() => {
        const updateChart = () => {
            const chartInstance = chartRef.current?.getEchartsInstance();
            if (!chartInstance) return;
            const rawData = devicesStore.getChartData(mastId, stationId, deviceId);
            const formattedData = rawData.map((d) => [d.timestamp, d.value]);
            chartInstance.setOption({
                series: [{ data: formattedData }],
            });
        };
        updateChart();
        const unsubscribe = devicesStore.subscribe(updateChart);
        return () => {
            unsubscribe();
        };
    }, [mastId, stationId, deviceId]);

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ReactECharts
                ref={chartRef}
                option={options}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge={false}
            />
        </div>
    );
};
