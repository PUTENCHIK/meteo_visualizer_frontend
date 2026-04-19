import clsx from 'clsx';
import s from './complex-item.module.scss';
import { EntityLabel } from '@components/entity-label';
import { dateFormatter } from '@utils/common';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import { IconButton } from '@components/icon-button';
import { ComponentRowBox } from '@components/component-row-box';
import { useDialogs } from '@context/dialog-context';
import { useDeleteComplex } from '@hooks/api-data/use-delete-complex';

interface ComplexItemProps {
    data: ComplexWithMastsSchema;
}

export const ComplexItem = ({ data }: ComplexItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteComplex();

    const updateComplex = () => {
        openDialog('complex', { complexId: data.id });
    };

    const deleteComplex = () => {
        openDialog('confirm-delete', {
            mode: 'both',
            onSubmit: async (force) => {
                await deleteMutation.mutateAsync({ id: data.id, force });
            },
            extra: {
                entityName: 'комплекс',
                entity: data,
            },
        });
    };

    return (
        <div className={clsx(s['complex-item'])}>
            <ComponentRowBox
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} field='id' />]}
                right={[
                    [
                        <IconButton iconName='star' title='Отслеживать' />,
                        <IconButton
                            iconName='pencil'
                            title='Редактировать'
                            onClick={updateComplex}
                        />,
                        <IconButton iconName='bin' title='Удалить' onClick={deleteComplex} />,
                    ],
                ]}
            />
            <span>Адрес TCP: {data.address ?? '-'}</span>
            <span>
                Расположение: {data.latitude} {data.longitude}
            </span>
            <span>Приватный: {data.is_private.toString()}</span>
            <ComponentRowBox
                left={[
                    <span>Добавил:</span>,
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
