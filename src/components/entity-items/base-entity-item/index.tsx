import clsx from 'clsx';
import s from './base-entity-item.module.scss';

interface BaseEntityItemProps {
    deleted?: boolean;
    children: React.ReactNode;
}

export const BaseEntityItem = ({ deleted = false, children }: BaseEntityItemProps) => {
    return <div className={clsx(s['entity-item'], deleted && s['deleted'])}>{children}</div>;
};
