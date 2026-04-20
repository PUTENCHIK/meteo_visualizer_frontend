import clsx from 'clsx';
import s from './secreted-label.module.scss';

export const SecretedLabel = () => {
    return <div className={clsx(s['secreted-label'])}>запаролен</div>;
};
