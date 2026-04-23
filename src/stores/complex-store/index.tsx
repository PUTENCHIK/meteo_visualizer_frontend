import type { ComplexWithFavoriteInfoSchema } from '@utils/schemas';
import { create } from 'zustand';

export * from './hooks';

interface ComplexState {
    complex: ComplexWithFavoriteInfoSchema | null;
    setComplex: (complex: ComplexWithFavoriteInfoSchema | null) => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
    complex: null,
    setComplex: (complex) => 
        set({
            complex: complex
        })
}));