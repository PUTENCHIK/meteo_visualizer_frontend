import { appSettings, sceneSettings } from "@utils/settings";
import { SettingsManager } from "./classes";

export const appSettingsManager = new SettingsManager(
    appSettings, 
    'appSettings'
);

export const sceneSettingsManager = new SettingsManager(
    sceneSettings, 
    'sceneSettings'
);
