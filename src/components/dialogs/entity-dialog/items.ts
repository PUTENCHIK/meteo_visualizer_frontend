import { ComplexItem } from '@entity-items/complex-item';
import { MastConfigItem } from '@entity-items/mast-config-item';
import type { EntityType } from './queries';
import type { ComponentType } from 'react';

export const entityComponents: Record<EntityType, ComponentType<{ data: any }>> = {
    'mast-config': MastConfigItem,
    complex: ComplexItem,
};
