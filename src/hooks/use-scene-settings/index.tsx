import { useSyncExternalStore } from 'react';
import type { sceneSettings, SettingsMap } from '@utils/settings';
import { sceneSettingsManager } from '@managers/settings-manager';

type SceneSettingsType = typeof sceneSettings;

export type SceneSettingsMapType = SettingsMap<SceneSettingsType>;

export const useSceneSettings = () => {
    useSyncExternalStore(
        (callback) => sceneSettingsManager.subscribe(callback),
        () => sceneSettingsManager.getRawSettings(),
    );

    return {
        raw: sceneSettingsManager.getRawSettings() as SceneSettingsType,
        map: sceneSettingsManager.settings as SceneSettingsMapType,
    };
};
