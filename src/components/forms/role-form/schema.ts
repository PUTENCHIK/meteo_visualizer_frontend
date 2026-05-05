import type { ScaleInterval } from '@utils/common';
import { Guid } from 'typescript-guid';
import { z } from 'zod';

const NAME: ScaleInterval = { min: 3, max: 255 };

export const roleSchema = z.object({
    name: z
        .string()
        .min(NAME.min, `Минимальная длина - ${NAME.min}`)
        .max(NAME.max, `Максимальная длина - ${NAME.max}`),
    parent_id: z
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .refine((value) => !value || Guid.isGuid(value), {
            error: 'Невалидный ID роли',
        }),
});

export type RoleFormData = z.infer<typeof roleSchema>;
