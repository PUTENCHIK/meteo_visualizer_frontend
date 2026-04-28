import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useDeleteRole } from '@hooks/roles/use-delete-role';
import { useRestoreRole } from '@hooks/roles/use-restore-role';
import { HasPermission } from '@pages/has-permission';
import type { RoleWithPermissionsSchema } from '@utils/schemas';
import { useState } from 'react';

interface RoleItemProps {
    data: RoleWithPermissionsSchema;
}

export const RoleItem = ({ data }: RoleItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteRole();
    const restoreMutation = useRestoreRole();
    const [showPermissions, setShowPermissions] = useState(false);
    const isDeleted = data.deleted_at !== null;

    const updateRole = () => {
        openDialog('edit-role', { roleId: data.id });
    };

    const deleteMast = () => {
        openDialog('confirm-delete', {
            mode: 'both',
            onSubmit: async (force) => {
                await deleteMutation.mutateAsync({ id: data.id, force });
            },
            extra: {
                entityName: 'Роль',
                entity: data,
            },
        });
    };

    const restoreComplex = () => {
        openDialog('confirm-restore', {
            extra: {
                entityName: 'Роль',
                entity: data,
            },
            onSubmit: async () => {
                await restoreMutation.mutateAsync({ id: data.id });
            },
        });
    };

    return (
        <BaseEntityItem isDeleted={isDeleted}>
            <ComponentRowBox
                left={[<EntityLabel entity={data} size='big' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission allOf={['role:update']}>
                                    <IconButton
                                        iconName='pencil'
                                        title='Редактировать'
                                        onClick={updateRole}
                                    />
                                </HasPermission>,
                                <HasPermission allOf={['role:delete']}>
                                    <IconButton
                                        iconName='bin'
                                        title='Удалить'
                                        onClick={deleteMast}
                                    />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='role:restore'>
                                <IconButton
                                    iconName='restore'
                                    title='Восстановить'
                                    onClick={restoreComplex}
                                />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <ComponentRowBox
                left={[
                    <span>Родительская роль:</span>,
                    <EntityLabel entity={data.parent} type='role' linkable />,
                ]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<h3>Разрешения</h3>]}
                right={[
                    <IconButton
                        iconName='checron'
                        title={showPermissions ? 'Свернуть' : 'Развернуть'}
                        iconSize={16}
                        iconRotate={showPermissions ? -90 : 90}
                        onClick={() => setShowPermissions((prev) => !prev)}
                    />,
                ]}
                size='tiny'
            />
            {data.permissions.length > 0 ? (
                showPermissions ? (
                    <ol>
                        {data.permissions.map((permission, index) => (
                            <li key={index}>{permission.name}</li>
                        ))}
                    </ol>
                ) : (
                    <span>{data.permissions.length} разрешений</span>
                )
            ) : (
                <span>Нет разрешений</span>
            )}
        </BaseEntityItem>
    );
};
