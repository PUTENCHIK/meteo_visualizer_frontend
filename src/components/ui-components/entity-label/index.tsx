import clsx from 'clsx';
import s from './entity-label.module.scss';
import { useAuthStore } from '@stores/auth-store';
import type { AuditableModelSchema } from '@utils/schemas';

type LabelSize = 'small' | 'big';

interface WithName extends AuditableModelSchema {
    name: string;
}
interface WithLogin extends AuditableModelSchema {
    login: string;
}

type DisplayableEntity = AuditableModelSchema | WithName | WithLogin;

interface EntityLabelProps<T extends DisplayableEntity> {
    entity: T;
    field?: keyof T;
    size?: LabelSize;
}

export const EntityLabel = <T extends DisplayableEntity>({
    entity,
    field,
    size = 'small',
}: EntityLabelProps<T>) => {
    const user = useAuthStore((state) => state.user);
    const entityId = entity.id.toString().slice(0, 8);

    const getLabel = (): string => {
        if (field) {
            return field === 'id' ? entityId : String(entity[field]);
        }
        if (user?.id === entity.id) {
            return 'Вы';
        }
        if ('name' in entity) return entity.name;
        else if ('login' in entity) return entity.login;
        else return entityId;
    };

    const color = entity.id.toString().slice(-6);

    return (
        <div
            className={clsx(s['entity-label'], s[size])}
            style={{
                backgroundColor: `#${color}`,
                color: `contrast-color(#${color})`,
            }}>
            {getLabel()}
        </div>
    );
};
