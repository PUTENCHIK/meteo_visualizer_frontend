import clsx from 'clsx';
import s from './mast-yard-item.module.scss';
import type { MastConfigSchema, MastYardSchema } from '@utils/schemas';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { useDeleteMastYard } from '@hooks/api-data/use-delete-mast-yard';

interface MastYardItemProps {
    data: MastYardSchema;
    config: MastConfigSchema;
}

export const MastYardItem = ({ data, config }: MastYardItemProps) => {
    const { openDialog } = useDialogs();

    const deleteMutation = useDeleteMastYard();

    const updateMastYard = () => {
        openDialog('edit-mast-yard', { config, mastYardId: data.id });
    };

    const deleteMastYard = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Рея мачты',
                entity: data,
            },
        });
    };

    return (
        <div className={clsx(s['mast-yard-item'])}>
            <ComponentRowBox
                left={[<span>Рея</span>, <EntityLabel entity={data} />]}
                right={[
                    <IconButton
                        iconName='pencil'
                        title='Редактировать'
                        iconSize={16}
                        onClick={updateMastYard}
                    />,
                    <IconButton
                        iconName='bin'
                        title='Удалить'
                        iconSize={16}
                        onClick={deleteMastYard}
                    />,
                ]}
                size='tiny'
            />
            <span>Высота размещения: {data.height} м</span>
            <ComponentRowBox
                left={[<span>Количество станций: {data.amount}</span>]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
        </div>
    );
};
