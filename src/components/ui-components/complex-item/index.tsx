import clsx from 'clsx';
import s from './complex-item.module.scss';
import { EntityLabel } from '@components/entity-label';
import { dateFormatter } from '@utils/common';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import { IconButton } from '@components/icon-button';
import { ComponentHeader } from '@components/component-header';

interface ComplexItemProps {
    data: ComplexWithMastsSchema;
}

export const ComplexItem = ({ data }: ComplexItemProps) => {
    return (
        <div className={clsx(s['complex-item'])}>
            <ComponentHeader
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} id />]}
                right={[
                    [
                        <IconButton iconName='star' title='Отслеживать' />,
                        <IconButton iconName='pencil' title='Изменить' />,
                        <IconButton iconName='bin' title='Удалить' />,
                    ],
                ]}
            />
            <span>Адрес TCP: {data.address ?? '-'}</span>
            <span>
                Расположение: {data.latitude} {data.longitude}
            </span>
            <span>Приватный: {data.is_private.toString()}</span>
            <ComponentHeader
                left={[
                    <span>Добавил: </span>,
                    data.creator ? <EntityLabel entity={data.creator} /> : 'Система',
                ]}
                size='tiny'
            />
            <span>{dateFormatter.format(new Date(data.updated_at))}</span>
            <h3>Мачты</h3>
            {data.masts.length === 0 && <span>Нет мачт</span>}
            {data.masts &&
                data.masts.map((mast, index) => <div key={index}>{mast.config.name}</div>)}
        </div>
    );
};
