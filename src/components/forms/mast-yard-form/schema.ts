import type { ScaleInterval } from '@utils/common';
import { Guid } from 'typescript-guid';
import { z } from 'zod';

const HEIGHT: ScaleInterval = { min: 2, max: 200 };
const AMOUNT: ScaleInterval = { min: 1, max: 10 };

export const mastYardSchema = z.object({
    config_id: z.string().refine((value) => Guid.isGuid(value), {
        error: 'Невалидный UUID',
    }),
    height: z
        .number()
        .min(HEIGHT.min, `Минимальная высота - ${HEIGHT.min} м.`)
        .max(HEIGHT.max, `Максимальная высота - ${HEIGHT.max} м.`),
    amount: z
        .number()
        .min(AMOUNT.min, `Минимальное кол-во станций - ${AMOUNT.min}`)
        .max(AMOUNT.max, `Максимальное кол-во станций - ${AMOUNT.max}`),
});

export type MastYardFormData = z.infer<typeof mastYardSchema>;
