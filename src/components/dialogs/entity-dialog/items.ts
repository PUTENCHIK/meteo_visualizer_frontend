import { ComplexItem } from '@components/complex-item';
import { MastConfigItem } from '@components/mast-config-item';
import type { EntityType } from './queries';

export const entityComponents: Record<EntityType, any> = {
    'mast-config': MastConfigItem,
    complex: ComplexItem,
};
