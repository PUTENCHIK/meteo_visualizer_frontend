import clsx from 'clsx';
import s from './base-entity-item.module.scss';

interface BaseEntityItemProps {
    isDeleted?: boolean;
    children: React.ReactNode;
}

export const BaseEntityItem = ({ isDeleted = false, children }: BaseEntityItemProps) => {
    return <div className={clsx(s['entity-item'], isDeleted && s['deleted'])}>{children}</div>;
};
