import { useComplex } from '@hooks/api-data/use-complex';
import { useMastConfig } from '@hooks/api-data/use-mast-config';

export const entityQueryHooks = {
    'mast-config': useMastConfig,
    complex: useComplex,
};

export type EntityType = keyof typeof entityQueryHooks;
