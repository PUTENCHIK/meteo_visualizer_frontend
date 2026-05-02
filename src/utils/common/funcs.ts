import type { MeasureColorSchema } from '@utils/schemas';
import { dateFormatter } from './consts';

export const copyObject = <T extends object>(obj: T): T => {
    if (!obj || typeof obj !== 'object') throw new Error(`obj mush be 'object', not ${typeof obj}`);
    return JSON.parse(JSON.stringify(obj));
};

export const joinWithSeparator = (
    items: (string | undefined | null)[],
    separator: string = '-',
): string => {
    return items.filter((i) => i).join(separator);
};

export const formatTimespamp = (value: string) => {
    if (!value) return 'N/A';

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    return dateFormatter.format(date).replace(' г.', ',').replace('в ', '');
};

export const parseColor = (hex: string, normalize: boolean = false) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return {
        r: normalize ? r / 255 : r,
        g: normalize ? g / 255 : g,
        b: normalize ? b / 255 : b,
    };
};

export const getColorAtPercent = (colors: MeasureColorSchema[], percent: number): string => {
    if (colors.length === 0) return '#000000';
    if (percent <= colors[0].percent) return colors[0].value;
    if (percent >= colors[colors.length - 1].percent) {
        return colors[colors.length - 1].value;
    }

    for (let i = 0; i < colors.length - 1; i++) {
        const start = colors[i];
        const end = colors[i + 1];

        if (percent >= start.percent && percent <= end.percent) {
            if (start.percent === end.percent) return start.value;

            const factor = (percent - start.percent) / (end.percent - start.percent);
            return interpolateColor(start.value, end.value, factor);
        }
    }
    return '#000000';
};

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const c1 = parseColor(color1);
    const c2 = parseColor(color2);

    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));

    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};
