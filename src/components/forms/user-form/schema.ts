import type { ScaleInterval } from '@utils/common';
import { z } from 'zod';

const LASTNAME: ScaleInterval = { min: 2, max: 255 };
const FIRSTNAME: ScaleInterval = { min: 2, max: 255 };
const SECONDNAME: ScaleInterval = { min: 0, max: 255 };

export const userSchema = z.object({
    lastname: z
        .string()
        .min(LASTNAME.min, `Минимальная длина - ${LASTNAME.min}`)
        .max(LASTNAME.max, `Максимальная длина - ${LASTNAME.max}`),
    firstname: z
        .string()
        .min(FIRSTNAME.min, `Минимальная длина - ${FIRSTNAME.min}`)
        .max(FIRSTNAME.max, `Максимальная длина - ${FIRSTNAME.max}`),
    secondname: z
        .string()
        .min(SECONDNAME.min, `Минимальная длина - ${SECONDNAME.min}`)
        .max(SECONDNAME.max, `Максимальная длина - ${SECONDNAME.max}`),
});

export type UserFormData = z.infer<typeof userSchema>;
