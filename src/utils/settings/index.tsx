import type { AtmosphereParticleForm } from '@models_/atmosphere-model';
import type { CompassType } from '@models_/compass-model';
import type { IconName } from '@utils/icons';

export type SettingsKind =
    | 'boolean'
    | 'number'
    | 'range'
    | 'string'
    | 'color'
    | 'select'
    | 'chapter'
    | 'tab'
    | 'tab-item';

interface Base {
    disabled?: boolean;
    visible?: boolean;
}

interface BaseSettingsPoint extends Base {
    kind: SettingsKind;
    title: string;
}

// Пункт настроек - конкретное значение указанного типа
export interface SettingsPoint<T> extends BaseSettingsPoint {
    value: T;
}

export interface BooleanSettings extends SettingsPoint<boolean> {
    kind: 'boolean';
}

export interface NumberSettings extends SettingsPoint<number> {
    kind: 'number';
    min?: number;
    max?: number;
    step?: number;
}

export interface RangeSettings extends SettingsPoint<number> {
    kind: 'range';
    min: number;
    max: number;
    step: number;
}

export interface StringSettings extends SettingsPoint<string> {
    kind: 'string';
    placeholder?: string;
    maxLength?: number;
}

export interface ColorSettings extends SettingsPoint<string> {
    kind: 'color';
}

export interface SelectSettings<T> extends SettingsPoint<T> {
    kind: 'select';
    options: T[];
}

// Раздел настроек
export interface SettingsChapter extends BaseSettingsPoint {
    kind: 'chapter';
    items: Record<string, SettingsItem>;
}

// Вкладка с настройками
export interface SettingsTabItem extends SettingsPoint<string> {
    kind: 'tab-item';
    content: Record<string, SettingsItem>;
}

// Меню с вкладками настроек
export interface SettingsTab extends SettingsPoint<string> {
    kind: 'tab';
    tabs: Record<string, SettingsTabItem>;
}

// Элемент секции или раздела настроек - это пункт или вложенный раздел
export type SettingsItem =
    | BooleanSettings
    | NumberSettings
    | RangeSettings
    | StringSettings
    | ColorSettings
    | SelectSettings<any>
    | SettingsChapter
    | SettingsTab;

// Глобальная секция настроек, отображаемая в худе
export interface SettingsSection extends Base {
    title: string;
    iconName: IconName;
    items: Record<string, SettingsItem>;
}

export type AppSettings = Record<string, SettingsSection>;

export type SettingsMap<T> = {
    // SettingsTab
    [key in keyof T]: T[key] extends { kind: 'tab' }
        ? { value: T[key] extends { value: infer V } ? V : string } & SettingsMap<
              T[key] extends { tabs: infer Tabs } ? Tabs : never
          >
        : // SettingsTabItem
          T[key] extends { kind: 'tab-item' }
          ? // { value: T[key] extends SettingsTabItem<infer C> ? C : never } &
            SettingsMap<T[key] extends { content: infer C } ? C : never>
          : // SettingsPoint
            T[key] extends { value: infer V }
            ? V
            : // SettingSection или SettingChapter
              T[key] extends { items: infer I }
              ? SettingsMap<I>
              : T[key];
};

export const createSettingsProxy = <T extends AppSettings>(target: T): SettingsMap<T> => {
    return new Proxy(target, {
        get(obj: any, prop: string) {
            // SettingsSection и SettingsChapter
            if (obj.items && typeof obj.items === 'object') {
                return createSettingsProxy(obj.items)[prop];
            }

            if (obj.kind === 'tab') {
                // SettingsTab.value
                if (prop === 'value') return obj.value;
                // SettingsTabItem
                if (obj.tabs && prop in obj.tabs) {
                    const tabItem = obj.tabs[prop];
                    return createSettingsProxy(tabItem.content);
                }
            }

            const item = obj[prop];
            if (item && typeof item === 'object') {
                // SettingsPoint
                if ('value' in item && item.kind !== 'tab') {
                    return item.value;
                }
                return createSettingsProxy(item);
            }

            return item;
        },
    }) as SettingsMap<T>;
};

export const createBoolean = <T extends boolean>(
    title: string,
    value: T,
    others?: Partial<Omit<BooleanSettings, 'kind' | 'title' | 'value'>>,
) => {
    return {
        kind: 'boolean' as const,
        title: title,
        value: value,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createNumber = <T extends number>(
    title: string,
    value: T,
    others?: Partial<Omit<NumberSettings, 'kind' | 'title' | 'value'>>,
) => {
    return {
        kind: 'number' as const,
        title: title,
        value: value,
        min: others?.min,
        max: others?.max,
        step: others?.step,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createRange = <T extends number>(
    title: string,
    value: T,
    min: T,
    max: T,
    step: T,
    others?: Partial<Omit<RangeSettings, 'kind' | 'title' | 'value' | 'min' | 'max' | 'step'>>,
) => {
    return {
        kind: 'range' as const,
        title: title,
        value: value,
        min: min,
        max: max,
        step: step,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createString = <T extends string>(
    title: string,
    value: T,
    others?: Partial<Omit<StringSettings, 'kind' | 'title' | 'value'>>,
) => {
    return {
        kind: 'string' as const,
        title: title,
        value: value,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createColor = <T extends string>(
    title: string,
    value: T,
    others?: Partial<Omit<ColorSettings, 'kind' | 'title' | 'value'>>,
) => {
    return {
        kind: 'color' as const,
        title: title,
        value: value,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createSelect = <T,>(
    title: string,
    value: T,
    options: T[],
    others?: Partial<Omit<SelectSettings<T>, 'kind' | 'title' | 'value' | 'options'>>,
) => {
    return {
        kind: 'select' as const,
        title: title,
        value: value,
        options: options,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createChapter = <T extends Record<string, SettingsItem>>(
    title: string,
    items: T,
    others?: Partial<Omit<SettingsChapter, 'kind' | 'title' | 'items'>>,
) => {
    return {
        kind: 'chapter' as const,
        title: title,
        items: items,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createTabItem = <T extends string, K extends Record<string, SettingsItem>>(
    title: string,
    value: T,
    content: K,
    others?: Partial<Omit<SettingsTabItem, 'kind' | 'title' | 'value' | 'content'>>,
) => {
    return {
        kind: 'tab-item' as const,
        title: title,
        value: value,
        content: content,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createTab = <K extends Record<string, SettingsTabItem>, T extends K[keyof K]['value']>(
    title: string,
    value: T,
    tabs: K,
    others?: Partial<Omit<SettingsTab, 'kind' | 'title' | 'current' | 'tabs'>>,
) => {
    return {
        kind: 'tab' as const,
        title: title,
        value: value,
        tabs: tabs,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

export const createSection = <T extends Record<string, SettingsItem>>(
    title: string,
    iconName: IconName,
    items: T,
    others?: Partial<Omit<SettingsSection, 'title' | 'iconName' | 'items'>>,
) => {
    return {
        title: title,
        iconName: iconName,
        items: items,
        disabled: others?.disabled ?? false,
        visible: others?.visible ?? true,
        ...others,
    };
};

const rawSettings = {
    scene: createSection('Настройки сцены', 'scene', {
        background: createChapter('Фон', {
            enable: createBoolean('Имитация неба', false),
        }),
        edges: createChapter('Границы', {
            enable: createBoolean('Отображение', true),
            threshold: createRange('Угол появления', 15, 1, 180, 1),
            scale: createRange('Вынос', 1, 0.8, 1.2, 0.01),
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
        grid: createChapter('Сетка', {
            enable: createBoolean('Отображение', false),
        }),
    }),
    model: createSection('Настройки модели комплекса', 'building', {
        basePlate: createChapter('Базовая плита', {
            enable: createBoolean('Отображение', true),
            height: createRange('Высота', 5, 1, 30, 1),
            padding: createRange('Отступ от мачт', 100, 20, 200, 1),
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
            yardsColor: createColor('Цвет мачтовых рей', 'rgba(104, 104, 104, 1)'),
        }),
        weatherStation: createChapter('Метеостанции', {
            radius: createRange('Радиус', 0.35, 0.2, 0.5, 0.05),
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
        scale: createChapter('Шкала значений', {
            min: createRange('Минимум', 20, 0, 50, 1),
            max: createRange('Максимум', 35, 0, 50, 1),
        }),
        maxStations: createNumber(
            'Максимальное принимаемое визуализациями количество метеостанций',
            128,
            { visible: false },
        ),
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
        focusOffset: createNumber('Отступ при фокусировке на меше', 40, { visible: false }),
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
