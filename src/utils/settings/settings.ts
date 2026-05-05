import type { AtmosphereParticleForm } from '@models_/atmosphere-model';
import type { CompassType } from '@models_/compass-model';
import {
    createBoolean,
    createChapter,
    createColor,
    createNumber,
    createRange,
    createSection,
    createSelect,
    createTab,
    createTabItem,
} from './funcs';
import type { AppSettings } from './structure';

const rawSettings = {
    scene: createSection('Настройки сцены', 'scene', {
        background: createChapter('Фон', {
            enable: createBoolean('Имитация неба', false),
        }),
        edges: createChapter('Границы', {
            enable: createBoolean('Отображение', true),
            thickness: createRange('Толщина', 1, 0.5, 5, 0.5),
            color: createColor('Цвет', 'black'),
        }),
        light: createChapter('Источники света', {
            ambient: createChapter('Обтекающий', {
                enable: createBoolean('Отображение', true),
                intensity: createRange('Интенсивность', 2, 0, 3, 0.1),
                color: createColor('Цвет', 'rgb(255, 255, 255)'),
            }),
            directional: createChapter('Прямой', {
                enable: createBoolean('Отображение', true),
                intensity: createRange('Интенсивность', 2, 0, 3, 0.1),
                color: createColor('Цвет', 'rgb(255, 255, 255)'),
            }),
        }),
        shadows: createChapter('Продвинутые тени', {
            enable: createBoolean('Отображение', true),
            mapSize: createSelect('Детализация', 2048, [1024, 2048, 4096, 8192]),
        }),
        grid: createChapter('Сетка', {
            enable: createBoolean('Отображение', false),
        }),
    }),
    model: createSection('Настройки модели комплекса', 'building', {
        basePlate: createChapter('Базовая плита', {
            enable: createBoolean('Отображение', true),
            height: createRange('Высота', 5, 1, 30, 1),
            padding: createRange('Отступ от мачт', 100, 20, 200, 1),
            square: createBoolean('Всегда квадрат', false),
            color: createColor('Цвет', 'rgba(116, 116, 116, 1)'),
        }),
        telescope: createChapter('КСТ-3', {
            enable: createBoolean('Отображение', true),
            height: createRange('Высота', 12, 5, 20, 1),
            radius: createRange('Радиус', 10, 5, 20, 1),
            length: createRange('Длина', 35, 0, 50, 5),
            color: createColor('Цвет', 'rgba(104, 104, 104, 1)'),
        }),
        masts: createChapter('Мачты', {
            radius: createRange('Радиус', 0.3, 0.2, 0.5, 0.05),
            plates: createChapter('Основания мачт', {
                enable: createBoolean('Отображение', true),
                size: createRange('Размер', 15, 5, 30, 1),
                height: createRange('Высота', 0.25, 0.1, 1, 0.05),
                color: createColor('Цвет', 'rgba(104, 104, 104, 1)'),
            }),
            mastsColor: createColor('Цвет мачт', 'rgba(104, 104, 104, 1)'),
        }),
        weatherStation: createChapter('Метеостанции', {
            radius: createRange('Радиус', 0.35, 0.2, 0.5, 0.05),
            occludeInfoBox: createBoolean('Скрытие инф. окна', false),
            color: createColor('Цвет', 'rgba(87, 104, 201, 1)'),
        }),
        sun: createChapter('Солнце', {
            enable: createBoolean('Отображение', true),
            size: createRange('Размер', 5, 1, 20, 1),
            orbitalRadius: createRange('Радиус орбиты', 200, 100, 500, 10),
            color: createColor('Цвет', 'rgba(255, 204, 0, 1)'),
        }),
    }),
    atmosphere: createSection('Настройки модели атмосферы', 'wind', {
        enable: createBoolean('Отображение', false),
        degreeOfInterpolation: createRange('Степень интерполяции', 3, 1, 4, 1),
        maxStations: createNumber(
            'Максимальное принимаемое шейдерами количество метеостанций',
            128,
            { visible: false },
        ),
        fps: createRange('FPS', 60, 5, 60, 1),
        model: createTab('Вид модели', 'particles', {
            particles: createTabItem('Частицы', 'particles', {
                height: createRange('Высота', 60, 20, 300, 5),
                size: createRange('Размер', 1, 0.7, 5, 0.1),
                segments: createRange('Кол-во сегментов', 8, 8, 64, 8, { visible: false }),
                frequency: createRange('Частота', 0.08, 0.01, 0.3, 0.01),
                opacity: createRange('Прозрачность', 0.5, 0.1, 1, 0.05),
                form: createSelect<AtmosphereParticleForm>('Форма', 'sphere', ['sphere', 'cube']),
            }),
            heatmap: createTabItem('Тепловая карта', 'heatmap', {
                height: createRange('Высота', 30, 1, 100, 1),
                pixelAmount: createRange('Кол-во пикселей', 100, 1, 512, 1),
                opacity: createRange('Прозрачность', 0.5, 0.1, 1, 0.1),
            }),
            pillarmap: createTabItem('Столбчатая карта', 'pillarmap', {
                height: createRange('Высота', 70, 10, 100, 1),
                pixelAmount: createRange('Кол-во пикселей', 64, 1, 128, 1),
                opacity: createRange('Прозрачность', 0.3, 0.1, 1, 0.1),
            }),
        }),
    }),
    compass: createSection('Настройки компаса', 'compass', {
        enable: createBoolean('Отображение', true),
        type: createSelect<CompassType>('Режим', '2D', ['2D', '3D']),
        size: createRange('Размер', 100, 70, 130, 5),
    }),
    camera: createSection('Настройки камеры', 'camera', {
        noLimits: createBoolean('Свободная камера', false),
        minDistance: createRange('Дистанция приближения', 50, 10, 800, 10),
        maxDistance: createRange('Дистанция отдаления', 500, 30, 800, 10),
        maxPolarAngle: createRange('Максимальный полярный угол', 89, 0, 180, 1),
        focusOffset: createNumber('Отступ при фокусировке на меше', 4, { visible: false }),
        focusPadding: createNumber('Другой отступ при фокусировке на меше', 4, { visible: false }),
    }),
    ui: createSection(
        'UI',
        'arrow',
        {
            windows: createChapter('Диалоговые окна', {
                minWidth: createNumber('Мин. ширина', 200),
                maxWidth: createNumber('Макс. ширина', 600),
                minHeight: createNumber('Макс. высота', 200),
                maxHeight: createNumber('Макс. высота', 800),
            }),
        },
        { visible: false },
    ),
} satisfies AppSettings;

export const appSettings = rawSettings;
