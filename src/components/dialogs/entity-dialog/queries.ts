import { useComplex } from '@hooks/complexes/use-complex';
import { useMastConfig } from '@hooks/mast-configs/use-mast-config';

export const entityQueryHooks = {
    'mast-config': useMastConfig,
    complex: useComplex,
};

export type EntityType = keyof typeof entityQueryHooks;
