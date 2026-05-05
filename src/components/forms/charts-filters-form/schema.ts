import { z } from 'zod';

export const chartsFiltersSchema = z.object({
    mastId: z.string().min(1, 'Выберите мачту'),
    stationId: z.string().min(1, 'Выберите станцию'),
    deviceId: z.string().min(1, 'Выберите датчик'),
});

export type ChartsFiltersFormData = z.infer<typeof chartsFiltersSchema>;
