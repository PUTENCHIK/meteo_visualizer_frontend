import type { IconName } from '@utils/icons';
import type {
    BooleanSettings,
    ColorSettings,
    NumberSettings,
    RangeSettings,
    SelectSettings,
    SettingsChapter,
    SettingsItem,
    SettingsSection,
    SettingsTab,
    SettingsTabItem,
    StringSettings,
} from './structure';

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

export const createSelect = <T>(
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
    iconName: IconName | null,
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
