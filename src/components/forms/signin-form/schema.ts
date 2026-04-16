import { z } from 'zod';

export const signinSchema = z.object({
    username: z.string().min(1, `Введите логин`),
    password: z.string().min(1, `Введите пароль`),
});

export type SigninFormData = z.infer<typeof signinSchema>;
