type ForceEdgesMode = 'with' | 'without';

export interface EdgesEnable {
    forceEdges?: ForceEdgesMode;
}

export interface Namable {
    name?: string;
}
