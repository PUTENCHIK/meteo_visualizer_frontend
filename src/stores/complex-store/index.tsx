import { Mast, WeatherStation, type MastDto } from '@utils/complexes';
import { PolarPosition } from '@utils/coordinate-systems';
import type { Vector3 } from 'three';
import type { Guid } from 'typescript-guid';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export * from './hooks';

interface ComplexState {
    masts: Mast[];
    getMast: (id: Guid) => Mast | undefined;
    getMastByPrefix: (prefix: string) => Mast | undefined;
    addMast: () => void;
    updateMast: (id: Guid, data: Partial<Omit<Mast, 'id' | 'stations'>>) => void;
    deleteMast: (id: Guid) => void;

    getStation: (id: Guid) => WeatherStation | undefined;

    stationsPositions: Record<string, Vector3>;
    setStationPosition: (id?: string, position?: Vector3) => void;
}

export const useComplexStore = create<ComplexState>()(
    persist(
        (set, get) => ({
            masts: [],

            getMast: (id) => {
                return get().masts.find((m) => m.id.toString() === id.toString());
            },

            getMastByPrefix: (prefix) => {
                return get().masts.find((m) => m.prefix.toLowerCase() === prefix.toLowerCase());
            },

            addMast: () =>
                set((state) => ({
                    masts: [...state.masts, new Mast('', new PolarPosition(), 0, '')],
                })),

            updateMast: (id, data) =>
                set((state) => ({
                    masts: state.masts.map((m) => (m.id === id ? Object.assign(m, data) : m)),
                })),

            deleteMast: (id) =>
                set((state) => ({
                    masts: state.masts.filter((m) => m.id !== id),
                })),

            getStation: (id) => {
                const masts = get().masts;
                for (const mast of masts) {
                    const station = mast.stations.find((s) => s.id === id);
                    if (station) return station;
                }
                return undefined;
            },

            stationsPositions: {},

            setStationPosition: (id, position) => {
                if (!id || !position) return;
                set((state) => ({
                    stationsPositions: {
                        ...state.stationsPositions,
                        [id]: position,
                    },
                }));
            },
        }),
        {
            name: 'masts',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                masts: state.masts,
            }),
            onRehydrateStorage: () => (state) => {
                if (state && state.masts) {
                    state.masts = (state.masts as unknown as MastDto[]).map((data) =>
                        Mast.fromJSON(data),
                    );
                }
            },
        },
    ),
);
