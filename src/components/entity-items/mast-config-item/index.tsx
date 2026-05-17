import type { MastConfigSchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import { useDeleteMastConfig } from '@hooks/mast-configs/use-delete-mast-config';
import { useRestoreMastConfig } from '@hooks/mast-configs/use-restore-mast-config';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { MastYardItem } from '@entity-items/mast-yard-item';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { HasPermission } from '@pages/has-permission';

interface MastConfigItemProps {
    data: MastConfigSchema;
}

export const MastConfigItem = ({ data }: MastConfigItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteMastConfig();
    const restoreMutation = useRestoreMastConfig();

    const isDeleted = data.deleted_at !== null;

    const updateMastConfig = () => {
        openDialog('edit-mast-config', { configId: data.id });
    };

    const deleteMastConfig = () => {
        openDialog('confirm-delete', {
            mode: 'soft',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Конфиг мачты',
                entity: data,
            },
        });
    };

    const restoreMastConfig = () => {
        openDialog('confirm-restore', {
            extra: {
                entityName: 'Конфиг мачты',
                entity: data,
            },
            onSubmit: async () => {
                await restoreMutation.mutateAsync({ id: data.id });
            },
        });
    };

    return (
        <BaseEntityItem deleted={isDeleted}>
            <ComponentRowBox
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} field='id' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission permission='mast_config:update'>
                                    <IconButton
                                        iconName='pencil'
                                        title='Редактировать'
                                        onClick={updateMastConfig}
                                    />
                                </HasPermission>,
                                <HasPermission permission='mast_config:delete'>
                                    <IconButton
                                        iconName='bin'
                                        title='Удалить'
                                        onClick={deleteMastConfig}
                                    />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='mast_config:restore'>
                                <IconButton
                                    iconName='restore'
                                    title='Восстановить'
                                    onClick={restoreMastConfig}
                                />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <ComponentRowBox
                left={[<span>Высота: {data.height} м</span>]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
            {!isDeleted && (
                <>
                    <ComponentRowBox
                        left={[<h3>Реи</h3>]}
                        right={[
                            <HasPermission permission='mast_yard:create'>
                                <IconButton
                                    iconName='plus'
                                    title='Добавить рею'
                                    type='primary'
                                    iconSize={'small'}
                                    onClick={() => openDialog('edit-mast-yard', { config: data })}
                                />
                            </HasPermission>,
                        ]}
                    />
                    {data.yards.length === 0 && <span>Нет рей</span>}
                    {data.yards &&
                        data.yards.map((yard, index) => (
                            <MastYardItem key={index} config={data} data={yard} />
                        ))}
                </>
            )}
        </BaseEntityItem>
    );
};
