import clsx from 'clsx';
import s from './mast-item.module.scss';
import type { ComplexSchema, MastSchema } from '@utils/schemas';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { useDeleteMast } from '@hooks/api-data/use-delete-mast';

interface MastItemProps {
    data: MastSchema;
    complex: ComplexSchema;
}

export const MastItem = ({ data, complex }: MastItemProps) => {
    const { openDialog } = useDialogs();

    const deleteMutation = useDeleteMast();

    const updateMast = () => {
        openDialog('edit-mast', { complex: complex, mastId: data.id });
    };

    const deleteMast = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Мачта',
                entity: data,
            },
        });
    };

    return (
        <div className={clsx(s['mast-item'])}>
            <ComponentRowBox
                left={[<span>Мачта</span>, <EntityLabel entity={data} />]}
                right={[
                    <IconButton
                        iconName='pencil'
                        title='Редактировать'
                        iconSize={16}
                        onClick={updateMast}
                    />,
                    <IconButton
                        iconName='bin'
                        title='Удалить'
                        iconSize={16}
                        onClick={deleteMast}
                    />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<span>Конфиг:</span>, <EntityLabel entity={data.config} />]}
                size='tiny'
            />
            <span>
                Расположение: {data.latitude} {data.longitude}
            </span>
            <ComponentRowBox
                left={[<span>Угол поворота: {data.rotation}</span>]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
        </div>
    );
};
