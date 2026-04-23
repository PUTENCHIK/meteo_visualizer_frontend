import { useEffect, useRef, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
    deviceName: string;
    measure: string;
}

export const LineChart = ({ deviceName, measure }: LineChartProps) => {
    const chartRef = useRef<ReactECharts>(null);

    const options = useMemo(
        () => ({
            animation: false,
            grid: { top: 10, right: 10, bottom: 40, left: 50 },
            tooltip: { trigger: 'axis', animation: false },
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
            },
            yAxis: {
                type: 'value',
                scale: true,
                splitLine: { lineStyle: { type: 'dashed' } },
            },
            series: [
                {
                    name: measure,
                    type: 'line',
                    showSymbol: false,
                    data: [],
                    lineStyle: { color: '#8884d8', width: 2 },
                    sampling: 'lttb',
                },
            ],
        }),
        [measure],
    );

    useEffect(() => {
        // const updateChart = () => {
        //     const chartInstance = chartRef.current?.getEchartsInstance();
        //     if (!chartInstance) return;

        //     const rawData = store.getChartData(deviceName, measure);
        //     const formattedData = rawData.map((d) => [d.timestamp, d.value]);

        //     chartInstance.setOption({
        //         series: [{ data: formattedData }],
        //     });
        // };

        // updateChart();

        // const unsubscribe = store.subscribe(updateChart);
        // return () => {
        //     unsubscribe();
        // };
    }, [deviceName, measure]);

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
