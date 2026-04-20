import type { Guid } from 'typescript-guid';
import type { ManyToManyModelSchema } from './base';
import type { ComplexSchema } from './complexes';
import type { UserSchema } from './users';

export interface ComplexFavoriteSchema extends ManyToManyModelSchema {
    complex_id: Guid;
    complex: ComplexSchema;
    user_id: Guid;
    user: UserSchema;
    creator: UserSchema | null;
}
