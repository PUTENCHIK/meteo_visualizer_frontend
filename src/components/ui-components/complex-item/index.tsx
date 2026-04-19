import clsx from 'clsx';
import s from './complex-item.module.scss';
import { EntityLabel } from '@components/entity-label';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import { IconButton } from '@components/icon-button';
import { ComponentRowBox } from '@components/component-row-box';
import { useDialogs } from '@context/dialog-context';
import { useDeleteComplex } from '@hooks/api-data/use-delete-complex';
import { ComplexStatusLabel } from '@components/complex-status-label';
import { TimestampLabel } from '@components/timestamp-label';
import { MastItem } from '@components/mast-item';

interface ComplexItemProps {
    data: ComplexWithMastsSchema;
}

export const ComplexItem = ({ data }: ComplexItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteComplex();

    const updateComplex = () => {
        openDialog('edit-complex', { complexId: data.id });
    };

    const deleteComplex = () => {
        openDialog('confirm-delete', {
            mode: 'both',
            onSubmit: async (force) => {
                await deleteMutation.mutateAsync({ id: data.id, force });
            },
            extra: {
                entityName: 'Комплекс',
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
                        [<ComplexStatusLabel isPrivate={data.is_private} />],
                        [
                            <IconButton iconName='star' title='Отслеживать' />,
                            <IconButton
                                iconName='pencil'
                                title='Редактировать'
                                onClick={updateComplex}
                            />,
                            <IconButton iconName='bin' title='Удалить' onClick={deleteComplex} />,
                        ],
                    ],
                ]}
            />
            <span>Адрес TCP: {data.address ?? '-'}</span>
            <span>
                Расположение: {data.latitude} {data.longitude}
            </span>
            <ComponentRowBox
                left={[
                    [
                        <span>Добавил:</span>,
                        data.creator ? <EntityLabel entity={data.creator} /> : 'Система',
                    ],
                ]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<h3>Мачты</h3>]}
                right={[
                    <IconButton
                        iconName='plus'
                        title='Добавить мачту'
                        type='primary'
                        iconSize={16}
                        onClick={() => openDialog('edit-mast', { complex: data })}
                    />,
                ]}
            />
            {data.masts.length === 0 && <span>Нет мачт</span>}
            {data.masts &&
                data.masts.map((mast, index) => (
                    <MastItem key={index} data={mast} complex={data} />
                ))}
        </div>
    );
};
