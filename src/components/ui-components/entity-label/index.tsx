import clsx from 'clsx';
import s from './entity-label.module.scss';
import { useAuthStore } from '@stores/auth-store';
import type { AuditableModelSchema } from '@utils/schemas';

interface WithName extends AuditableModelSchema {
    name: string;
}
interface WithLogin extends AuditableModelSchema {
    login: string;
}

type DisplayableEntity = AuditableModelSchema | WithName | WithLogin;

interface EntityLabelProps<T extends DisplayableEntity> {
    entity: T;
    id?: boolean;
}

export const EntityLabel = <T extends DisplayableEntity>({
    entity,
    id = false,
}: EntityLabelProps<T>) => {
    const user = useAuthStore((state) => state.user);
    const entityId = entity.id.toString().slice(-8);

    const getLabel = (): string => {
        if (user?.id === entity.id) {
            return 'Вы';
        }
        if (!id) {
            if ('name' in entity) return entity.name;
            else if ('login' in entity) return entity.login;
        }
        return entityId;
    };

    const color = entity.id.toString().slice(-6);

    return (
        <div
            className={clsx(s['entity-label'])}
            style={{
                backgroundColor: `#${color}`,
                color: `contrast-color(#${color})`,
            }}>
            {getLabel()}
        </div>
    );
};
