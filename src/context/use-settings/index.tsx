import { useSyncExternalStore } from 'react';
import { settingsManager } from '@managers/settings-manager';
import type { appSettings, SettingsMap } from '@utils/settings';

type AppSettingsType = typeof appSettings;

export type SettingsMapType = SettingsMap<AppSettingsType>;

export const useSettings = () => {
    useSyncExternalStore(
        (callback) => settingsManager.subscribe(callback),
        () => settingsManager.getRawSettings(),
    );

    return {
        raw: settingsManager.getRawSettings() as AppSettingsType,
        map: settingsManager.settings as SettingsMapType,
    };
};
