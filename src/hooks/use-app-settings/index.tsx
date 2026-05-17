import { useSyncExternalStore } from 'react';
import type { appSettings, SettingsMap } from '@utils/settings';
import { appSettingsManager } from '@managers/settings-manager';

type AppSettingsType = typeof appSettings;

export type AppSettingsMapType = SettingsMap<AppSettingsType>;

export const useAppSettings = () => {
    useSyncExternalStore(
        (callback) => appSettingsManager.subscribe(callback),
        () => appSettingsManager.getRawSettings(),
    );

    return {
        raw: appSettingsManager.getRawSettings() as AppSettingsType,
        map: appSettingsManager.settings as AppSettingsMapType,
    };
};
