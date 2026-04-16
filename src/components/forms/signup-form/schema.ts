import type { ScaleInterval } from '@utils/common';
import { z } from 'zod';

const LASTNAME: ScaleInterval = { min: 2, max: 255 };
const FIRSTNAME: ScaleInterval = { min: 2, max: 255 };
const SECONDNAME: ScaleInterval = { min: 2, max: 255 };
const LOGIN: ScaleInterval = { min: 4, max: 20 };
const PASSWORD: ScaleInterval = { min: 6, max: 100 };

export const signupSchema = z
    .object({
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
        login: z
            .string()
            .min(LOGIN.min, `Минимальная длина - ${LOGIN.min}`)
            .max(LOGIN.max, `Максимальная длина - ${LOGIN.max}`)
            .regex(/^[a-zA-Z0-9_-]+$/, 'Допустимы только латинские буквы, цифры, _ и -'),
        password: z
            .string()
            .min(PASSWORD.min, `Минимальная длина - ${PASSWORD.min}`)
            .max(PASSWORD.max, `Максимальная длина - ${PASSWORD.max}`)
            .regex(
                /^[a-zA-Z0-9_!@#$%^&*()[]{}.,:;?-]+$/,
                'Допустимы только латинские буквы, цифры и спец. символы',
            )
            .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
            .regex(/[0-9]/, 'Нужна хотя бы одна цифра')
            .regex(/[_!@#$%^&*()[]{}.,:;?-]/, 'Нужен хотя бы один спец. символ'),
        passwordAgain: z.string().min(1, 'Повторите пароль'),
    })
    .refine((data) => data.password === data.passwordAgain, {
        message: 'Пароли не совпадают',
        path: ['passwordAgain'],
    });

export type SignupFormData = z.infer<typeof signupSchema>;
