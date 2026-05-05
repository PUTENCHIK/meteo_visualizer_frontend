import type { ScaleInterval } from '@utils/common';
import { Guid } from 'typescript-guid';
import { z } from 'zod';

const NAME: ScaleInterval = { min: 2, max: 255 };

export const measureAliasSchema = z.object({
    measure_id: z.string().refine((value) => Guid.isGuid(value), {
        error: 'Невалидный UUID',
    }),
    name: z
        .string()
        .min(NAME.min, `Минимальная длина - ${NAME.min}`)
        .max(NAME.max, `Максимальная длина - ${NAME.max}`)
        .regex(/^[a-zA-Z0-9]+$/, 'Допустимы только латинские буквы и цифры'),
});

export type MeasureAliasFormData = z.infer<typeof measureAliasSchema>;
