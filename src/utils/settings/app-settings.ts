import { type AppTheme } from '@context/theme-context';
import { createBoolean, createChapter, createRange, createSection, createSelect } from './funcs';
import type { SettingsType } from './structure';
import type { CompassType } from '@models_/compass-model';

const rawAppSettings = {
    common: createSection('Общие', 'settings', {
        theme: createSelect<AppTheme>('Тема', 'dark', ['light', 'dark']),
        fontSize: createSelect('Размер шрифта', 16, [14, 16, 18, 20]),
        colorEntityLabels: createBoolean('Красить обозначения сущностей', true),
    }),
    complexPage: createSection('Страница комплекса', 'building', {
        compass: createChapter('Компас', {
            enable: createBoolean('Отображение', true),
            type: createSelect<CompassType>('Режим', '2D', ['2D', '3D']),
            size: createRange('Размер', 100, 70, 130, 5),
        }),
        stats: createChapter('Статистика сцены', {
            enable: createBoolean('Отображение', true),
        }),
    }),
} satisfies SettingsType;

export const appSettings = rawAppSettings;
