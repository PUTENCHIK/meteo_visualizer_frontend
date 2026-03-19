import { useComplexData } from '@context/complex-data-context';
import { type ECharts, init } from 'echarts';
import { useEffect, useRef } from 'react';

interface FastLineChartProps {
    currentStation?: string;
}

export const FastLineChart = ({ currentStation }: FastLineChartProps) => {
    const { getFormattedData, getMeasureScale, measure } = useComplexData();

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ECharts | null>(null);

    const updateInterval = 100;

    useEffect(() => {
        const scale = getMeasureScale();

        if (chartRef.current) {
            // 1. Инициализация (используем Canvas, он быстрее для частых обновлений)
            chartInstance.current = init(chartRef.current, undefined, {
                renderer: 'canvas',
                useDirtyRect: true, // Оптимизация: перерисовывать только изменившиеся части
            });

            // Базовая конфигурация
            chartInstance.current.setOption({
                tooltip: {
                    show: true,
                    trigger: 'axis', // Срабатывает на всю вертикальную линию (удобно для линий)
                    confine: true, // Чтобы тултип не вылезал за границы контейнера
                    axisPointer: {
                        type: 'line', // Показывает вертикальную черту под курсором
                        label: {
                            backgroundColor: '#6a7985',
                        },
                    },
                    // Оптимизация: рендерим через Canvas, если точек ОЧЕНЬ много
                    renderMode: 'html',
                    // Форматирование даты в тултипе
                    valueFormatter: (value: number) => Number(value).toFixed(2),
                },

                xAxis: { type: 'time' },
                yAxis: { type: 'value', min: scale.min, max: scale.max },
                series: [{ id: 'main-series', type: 'line', data: [], animation: false }],
            });
        }

        // 2. Цикл обновления (Pull-модель)
        const updateLoop = setInterval(() => {
            if (!currentStation) return;
            if (chartInstance.current) {
                const freshData = getFormattedData(); // Забираем данные через коллбэк

                const data = freshData[currentStation];

                if (!data) return;

                const finalData = data.map((item) => [item.timestamp.getTime(), item.value]);

                chartInstance.current.setOption(
                    {
                        series: [{ id: 'main-series', data: finalData }],
                    },
                    { notMerge: false, lazyUpdate: true },
                );
            }
        }, updateInterval);

        // 3. Обработка ресайза
        const handleResize = () => chartInstance.current?.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(updateLoop);
            window.removeEventListener('resize', handleResize);
            chartInstance.current?.dispose();
        };
    }, [getFormattedData, getMeasureScale, currentStation, measure]);

    return <div ref={chartRef} style={{ width: '700px', height: '500px' }} />;
};
