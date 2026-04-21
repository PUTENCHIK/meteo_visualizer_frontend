import clsx from 'clsx';
import s from './base-entity-item.module.scss';

interface BaseEntityItemProps {
    children: React.ReactNode;
}

export const BaseEntityItem = ({ children }: BaseEntityItemProps) => {
    return <div className={clsx(s['entity-item'])}>{children}</div>;
};
