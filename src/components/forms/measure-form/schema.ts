import type { ScaleInterval } from '@utils/common';
import { z } from 'zod';

const NAME: ScaleInterval = { min: 2, max: 255 };
const SCALE: ScaleInterval = { min: -1000, max: 1000 };
const UNITS: ScaleInterval = { min: 1, max: 255 };

export const measureSchema = z.object({
    name: z
        .string()
        .min(NAME.min, `Минимальная длина - ${NAME.min}`)
        .max(NAME.max, `Максимальная длина - ${NAME.max}`),
    min: z
        .number()
        .min(SCALE.min, `Пределы шкалы: [${SCALE.min}, ${SCALE.max}]`)
        .max(SCALE.max, `Пределы шкалы: [${SCALE.min}, ${SCALE.max}]`),
    max: z
        .number()
        .min(SCALE.min, `Пределы шкалы: [${SCALE.min}, ${SCALE.max}]`)
        .max(SCALE.max, `Пределы шкалы: [${SCALE.min}, ${SCALE.max}]`),
    units: z
        .string()
        .min(UNITS.min, `Минимальная длина - ${UNITS.min}`)
        .max(UNITS.max, `Максимальная длина - ${UNITS.max}`),
});

export type MeasureFormData = z.infer<typeof measureSchema>;
