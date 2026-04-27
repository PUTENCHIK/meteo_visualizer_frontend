import type { ScaleInterval } from '@utils/common';
import { Guid } from 'typescript-guid';
import { z } from 'zod';

const VALUE_LENGTH = 7;
const PERCENT: ScaleInterval = { min: 0, max: 100 };

export const measureColorSchema = z.object({
    measure_id: z.string().refine((value) => Guid.isGuid(value), {
        error: 'Невалидный UUID',
    }),
    value: z
        .string()
        .min(VALUE_LENGTH, `Длина значения - ${VALUE_LENGTH}`)
        .max(VALUE_LENGTH, `Длина значения - ${VALUE_LENGTH}`),
    percent: z
        .number()
        .min(PERCENT.min, `Пределы процента: [${PERCENT.min}, ${PERCENT.max}]`)
        .max(PERCENT.max, `Пределы процента: [${PERCENT.min}, ${PERCENT.max}]`)
        .transform((value) => value / 100),
});

export type MeasureColorFormData = z.infer<typeof measureColorSchema>;
