import { mastConfigs } from "./consts";
import type { MastConfigName } from "./types";

export const getMastConfig = (name: MastConfigName) => {
    return mastConfigs.find((c) => c.name === name)!;
};