import type { ManyToManyModelSchema } from './base';
import type { ComplexWithMastsSchema } from './complexes';
import type { UserSchema } from './users';

export interface ComplexAccessSchema extends ManyToManyModelSchema {
    complex: ComplexWithMastsSchema;
    user: UserSchema;
    creator: UserSchema | null;
}
