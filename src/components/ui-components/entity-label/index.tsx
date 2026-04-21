import clsx from 'clsx';
import s from './entity-label.module.scss';
import { useAuthStore } from '@stores/auth-store';
import type { AuditableModelSchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import type { EntityType } from '@dialogs/entity-dialog/queries';

type LabelSize = 'small' | 'big';

interface WithName extends AuditableModelSchema {
    name: string;
}
interface WithLogin extends AuditableModelSchema {
    login: string;
}

type DisplayableEntity = AuditableModelSchema | WithName | WithLogin;

interface EntityLabelProps<T extends DisplayableEntity> {
    entity: T | null;
    field?: keyof T;
    size?: LabelSize;
    type?: EntityType;
    linkable?: boolean;
}

export const EntityLabel = <T extends DisplayableEntity>({
    entity,
    field,
    size = 'small',
    type,
    linkable = false,
}: EntityLabelProps<T>) => {
    const user = useAuthStore((state) => state.user);
    const { openDialog } = useDialogs();
    const entityId = entity ? entity.id.toString().slice(0, 8) : 'N/A';
    const color = entity ? entity.id.toString().slice(-6) : '808080';

    const getLabel = (): string => {
        if (!entity) {
            return entityId;
        }

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

    const handleClick = () => {
        if (type && linkable && entity) {
            openDialog('entity', { entityId: entity.id, type });
        }
    };

    return (
        <div
            className={clsx(
                s['entity-label'],
                s[size],
                type && linkable && entity && s['linkable'],
            )}
            style={{
                backgroundColor: `#${color}`,
                color: `contrast-color(#${color})`,
            }}
            onClick={handleClick}>
            {getLabel()}
        </div>
    );
};
