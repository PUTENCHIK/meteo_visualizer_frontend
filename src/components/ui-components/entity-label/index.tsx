import clsx from 'clsx';
import s from './entity-label.module.scss';
import { useAuthStore } from '@stores/auth-store';
import type { AuditableModelSchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import type { EntityType } from '@dialogs/entity-dialog/queries';
import type { Guid } from 'typescript-guid';
import { useAppSettings } from '@hooks/use-app-settings';
import { useMemo } from 'react';

type LabelSize = 'small' | 'big';

interface WithId {
    id: Guid;
}
interface WithName extends AuditableModelSchema {
    name: string;
}
interface WithLogin extends AuditableModelSchema {
    login: string;
}
interface WithPrefix extends AuditableModelSchema {
    prefix: string;
}

type DisplayableEntity = AuditableModelSchema | WithId | WithName | WithLogin | WithPrefix;

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
    const { map: settings } = useAppSettings();
    const { user } = useAuthStore();
    const { openDialog } = useDialogs();
    const entityId = entity?.id.toString();
    const idLabel = entity ? entity.id.toString().slice(0, 8) : 'N/A';
    const color = entity ? entity.id.toString().slice(0, 6) : '808080';

    const styles = useMemo(() => (settings.common.colorEntityLabels ? {
        backgroundColor: `#${color}`,
        color: `contrast-color(#${color})`,
    } : undefined), [settings.common.colorEntityLabels, color]);

    const getLabel = (): string => {
        if (!entity) {
            return idLabel;
        }

        if (field) {
            return field === 'id' ? idLabel : String(entity[field]);
        }
        if (user?.id === entity.id) {
            return 'Вы';
        }
        if ('name' in entity) return entity.name;
        else if ('login' in entity) return entity.login;
        else if ('prefix' in entity) return entity.prefix;
        else return idLabel;
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
            style={styles}
            title={entityId}
            onClick={handleClick}>
            {getLabel()}
        </div>
    );
};
