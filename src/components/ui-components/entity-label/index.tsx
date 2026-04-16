import clsx from 'clsx';
import s from './entity-label.module.scss';
import type { AuditableModel } from '@utils/http';

interface WithName extends AuditableModel {
    name: string;
}
interface WithLogin extends AuditableModel {
    login: string;
}

type DisplayableEntity = AuditableModel | WithName | WithLogin;

interface EntityLabelProps<T extends DisplayableEntity> {
    entity: T;
}

export const EntityLabel = <T extends DisplayableEntity>({ entity }: EntityLabelProps<T>) => {
    const getLabel = (): string => {
        if ('name' in entity) return entity.name;
        else if ('login' in entity) return entity.login;
        else return entity.id.toString().slice(-6);
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
