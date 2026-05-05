import type { ComplexWithFavoriteInfoSchema, MeasureWithDependentsSchema } from '@utils/schemas';
import { create } from 'zustand';

export * from './hooks';

interface ComplexState {
    complex: ComplexWithFavoriteInfoSchema | null;
    setComplex: (complex: ComplexWithFavoriteInfoSchema | null) => void;
    measure: MeasureWithDependentsSchema | null;
    setMeasure: (measure: MeasureWithDependentsSchema | null) => void;
    reset: () => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
    complex: null,
    setComplex: (complex) =>
        set({
            complex: complex,
        }),
    measure: null,
    setMeasure: (measure) =>
        set({
            measure: measure,
        }),
    reset: () => set({}),
}));
