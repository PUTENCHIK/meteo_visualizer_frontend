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
    return dateFormatter.format(new Date(value)).replace(' г.', ',').replace('в ', '');
};
