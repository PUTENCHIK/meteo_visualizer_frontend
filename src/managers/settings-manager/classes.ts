import { storageManager, type AppSettingsGroup } from '@managers/local-storage-manager';
import { copyObject } from '@utils/common';
import {
    createSettingsProxy,
    type SettingsMap,
    type SettingsType,
} from '@utils/settings';

interface ListenerParams {
    saveSettings: boolean;
}

export class SettingsManager<T extends SettingsType> {
    private rawSettings: T;
    public settings: SettingsMap<T>;
    private listeners: Set<(params?: Partial<ListenerParams>) => void> = new Set();

    private defaultSettings: T;
    private storageKey: AppSettingsGroup;

    public constructor(settingsObject: T, key: AppSettingsGroup) {
        const defaultObject = copyObject(settingsObject);
        this.defaultSettings = defaultObject;
        this.storageKey = key;
    
        const savedSettings = storageManager.getItem(this.storageKey);

        this.deepUpdate(this.defaultSettings, savedSettings);
        this.rawSettings = defaultObject;
        this.settings = createSettingsProxy(this.rawSettings);

        this.subscribe((params?: Partial<ListenerParams>) => {
            if (params?.saveSettings) {
                storageManager.setItem(key, this.rawSettings);
            }
        });
    }

    public getRawSettings(): T {
        return this.rawSettings;
    }

    public reset(): void {
        const source = copyObject(this.defaultSettings);
        this.deepUpdate(this.rawSettings, source);
    }

    private deepUpdate(target: any, source: any) {
        for (const key in source) {
            if (
                source[key] &&
                typeof source[key] === 'object' &&
                target[key] &&
                typeof target[key] === 'object'
            ) {
                if ('value' in source[key] && 'value' in target[key]) {
                    target[key].value = source[key].value;
                }

                if ('items' in source[key] && 'items' in target[key]) {
                    this.deepUpdate(target[key].items, source[key].items);
                } else if ('content' in source[key] && 'content' in target[key]) {
                    this.deepUpdate(target[key].content, source[key].content);
                } else if ('tabs' in source[key] && 'tabs' in target[key]) {
                    this.deepUpdate(target[key].tabs, source[key].tabs);
                }
            }
        }
    }

    public subscribe(callback: () => void): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    private notify(saveSettings: boolean): void {
        // Обновление ссылки на настройки для того, чтобы React увидел изменения
        this.rawSettings = { ...this.rawSettings };
        this.listeners.forEach((listener) => listener({ saveSettings: saveSettings }));
    }

    public get(path: string): any {
        const keys = path.split('.');
        let current: any = this.rawSettings;

        for (const key of keys) {
            if (current[key] == undefined) return undefined;

            current = current[key];
            if (!current || typeof current !== 'object') return undefined;

            if ('items' in current) {
                current = current.items;
            } else if ('tabs' in current) {
                current = current.tabs;
            }
        }

        return current && typeof current === 'object' && 'value' in current
            ? current.value
            : current;
    }

    public set(path: string, value: any, finalValue?: boolean): void {
        const keys = path.split('.');
        let current: any = this.rawSettings;
        let key: string;

        for (let i = 0; i < keys.length; i++) {
            key = keys[i];

            if (i === keys.length - 1) {
                if (current[key] && typeof current[key] === 'object' && 'value' in current[key]) {
                    current[key].value = value;
                } else {
                    current[key] = value;
                }
            } else {
                if (current[key]?.items) {
                    current = current[key].items;
                } else if (current[key]?.tabs) {
                    current = current[key].tabs;
                } else if (current[key]?.content) {
                    current = current[key].content;
                } else {
                    current = current[key];
                }
            }
        }

        this.notify(finalValue ?? true);
    }
}
