import { useComplex } from '@hooks/complexes/use-complex';
import { useMastConfig } from '@hooks/mast-configs/use-mast-config';
import { useRole } from '@hooks/roles/use-role';
import { useUser } from '@hooks/users/use-user';

export const entityQueryHooks = {
    'mast-config': useMastConfig,
    complex: useComplex,
    role: useRole,
    user: useUser,
};

export type EntityType = keyof typeof entityQueryHooks;
