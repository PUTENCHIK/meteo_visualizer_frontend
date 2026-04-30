import { ComplexItem } from '@entity-items/complex-item';
import { MastConfigItem } from '@entity-items/mast-config-item';
import type { EntityType } from './queries';
import type { ComponentType } from 'react';
import { RoleItem } from '@entity-items/role-item';
import { UserItem } from '@entity-items/user-item';
import { MeasureItem } from '@entity-items/measure-item';

export const entityComponents: Record<EntityType, ComponentType<{ data: any }>> = {
    'mast-config': MastConfigItem,
    complex: ComplexItem,
    role: RoleItem,
    user: UserItem,
    measure: MeasureItem,
};
