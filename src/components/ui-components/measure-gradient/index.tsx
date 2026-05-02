import clsx from 'clsx';
import s from './measure-gradient.module.scss';
import { useComplexStore } from '@stores/complex-store';
import { useMemo, useRef, useState } from 'react';
import { getColorAtPercent } from '@utils/common';
import { ColorDisplay } from '@components/color-display';
import { ComponentColumnsBox } from '@components/component-columns-box';

export const MeasureGradient = () => {
    const { measure } = useComplexStore();
    const gradientRef = useRef<HTMLDivElement>(null);

    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        left: number;
        percent: number;
        color: string;
    }>({
        visible: false,
        left: 0,
        percent: 0,
        color: '',
    });

    const colors = useMemo(() => {
        if (!measure) return [];
        return [...measure.colors].sort((c1, c2) => c1.percent - c2.percent);
    }, [measure]);

    const gradientStyle = useMemo(() => {
        if (colors.length < 2)
            return {
                background: 'none',
            };
        const stops = colors?.map((color) => `${color.value} ${color.percent * 100}%`).join(',');

        return {
            background: `linear-gradient(to right, ${stops})`,
        };
    }, [colors]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!gradientRef.current) return;

        const gradientRect = gradientRef.current.getBoundingClientRect();
        const x = event.clientX - gradientRect.left;
        const percent = Math.max(0, Math.min(1, x / gradientRect.width));

        setTooltip({
            visible: true,
            left: event.clientX,
            percent: percent,
            color: getColorAtPercent(colors, percent),
        });
    };

    const handleMouseLeave = () => {
        setTooltip((prev) => ({
            ...prev,
            visible: false,
        }));
    };

    if (!measure) return null;

    return (
        <div className={clsx(s['gradient-wrapper'])}>
            {measure && (
                <>
                    {tooltip.visible && (
                        <div
                            className={clsx(s['tooltip'])}
                            style={{
                                left: `${tooltip.left}px`,
                            }}>
                            <ComponentColumnsBox size='tiny'>
                                <ColorDisplay color={tooltip.color} size={16} />
                                <span className={clsx('no-wrap')}>
                                    {(
                                        measure.min +
                                        (measure.max - measure.min) * tooltip.percent
                                    ).toFixed(2)}
                                    {measure.units}
                                </span>
                            </ComponentColumnsBox>
                        </div>
                    )}
                    <div
                        style={gradientStyle}
                        className={clsx(s['gradient'])}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        ref={gradientRef}></div>
                </>
            )}
        </div>
    );
};
