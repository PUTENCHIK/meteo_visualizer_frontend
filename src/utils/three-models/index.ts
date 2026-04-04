type ForceMode = 'with' | 'without';

export interface EdgesEnable {
    forceEdges?: ForceMode;
}

export interface Namable {
    name?: string;
}

export interface Shadowable {
    forceShadow?: ForceMode;
}
