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
