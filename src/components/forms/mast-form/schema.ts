import type { ScaleInterval } from '@utils/common';
import { Guid } from 'typescript-guid';
import { z } from 'zod';

const PREFIX: ScaleInterval = { min: 2, max: 255 };
const ROTATION: ScaleInterval = { min: -360, max: 360 };

export const mastSchema = z.object({
    complex_id: z.string().refine((value) => Guid.isGuid(value), {
        error: 'Невалидный UUID',
    }),
    config_id: z.string().refine((value) => Guid.isGuid(value), {
        error: 'Выберите конфиг мачты',
    }),
    prefix: z
        .string()
        .min(PREFIX.min, `Минимальная длина - ${PREFIX.min}`)
        .max(PREFIX.max, `Максимальная длина - ${PREFIX.max}`),
    latitude: z.number('Введите число').min(-90, 'Широта [-90, 90]').max(90, 'Широта [-90, 90]'),
    longitude: z
        .number('Введите число')
        .min(-180, 'Долгота [-180, 180]')
        .max(180, 'Долгота [-180, 180]'),
    rotation: z
        .number()
        .min(ROTATION.min, `[${ROTATION.min}, ${ROTATION.max}]`)
        .max(ROTATION.max, `[${ROTATION.min}, ${ROTATION.max}]`),
});

export type MastFormData = z.infer<typeof mastSchema>;
