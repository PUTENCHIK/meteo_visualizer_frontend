import type { SettingsWithIconType } from './structure';

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

export const createSettingsProxy = <T extends SettingsWithIconType>(target: T): SettingsMap<T> => {
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
