import { dateFormatter } from './consts';

export const copyObject = <T extends object>(obj: T): T => {
    if (!obj || typeof obj !== 'object') throw new Error(`obj mush be 'object', not ${typeof obj}`);
    return JSON.parse(JSON.stringify(obj));
};

export const joinWithSeparator = (
    items: (string | undefined)[],
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
