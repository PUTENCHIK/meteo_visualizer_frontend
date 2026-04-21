import type { ScaleInterval } from '@utils/common';
import { z } from 'zod';

const NAME: ScaleInterval = { min: 2, max: 255 };
const HEIGHT: ScaleInterval = { min: 2, max: 200 };

export const mastConfigSchema = z.object({
    name: z
        .string()
        .min(NAME.min, `Минимальная длина - ${NAME.min}`)
        .max(NAME.max, `Максимальная длина - ${NAME.max}`),
    height: z
        .number()
        .min(HEIGHT.min, `Минимальная высота - ${HEIGHT.min} м.`)
        .max(HEIGHT.max, `Максимальная высота - ${HEIGHT.max} м.`),
});

export type MastConfigFormData = z.infer<typeof mastConfigSchema>;
