import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useDeleteUser } from '@hooks/users/use-delete-user';
import { useRestoreUser } from '@hooks/users/use-restore-user';
import { HasPermission } from '@pages/has-permission';
import { useAuthStore } from '@stores/auth-store';
import type { UserWithComplexesSchema } from '@utils/schemas';

interface UserItemProps {
    data: UserWithComplexesSchema;
    profile?: boolean;
}

export const UserItem = ({ data, profile = false }: UserItemProps) => {
    const { user, logout } = useAuthStore();
    const { openDialog, closeAllDialogs } = useDialogs();
    const deleteMutation = useDeleteUser();
    const restoreMutation = useRestoreUser();

    const isSelf = data.id === user?.id;
    const isDeleted = data.deleted_at !== null;

    const updateUser = () => {
        openDialog('edit-user', { userId: data.id });
    };

    const deleteUser = () => {
        openDialog('confirm-delete', {
            mode: 'soft',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Пользователь',
                entity: data,
            },
        });
    };

    const restoreUser = () => {
        openDialog('confirm-restore', {
            extra: {
                entityName: 'Пользователь',
                entity: data,
            },
            onSubmit: async () => {
                await restoreMutation.mutateAsync({ id: data.id });
            },
        });
    };

    const handleLogout = async () => {
        await logout();
        closeAllDialogs();
    };

    return (
        <BaseEntityItem deleted={isDeleted}>
            <ComponentRowBox
                left={[<EntityLabel entity={data} size='big' field='login' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission anyOf={['user:update', isSelf]}>
                                    <IconButton
                                        iconName='pencil'
                                        title='Редактировать'
                                        onClick={updateUser}
                                    />
                                </HasPermission>,
                                isSelf && profile && (
                                    <IconButton
                                        iconName='logout'
                                        title='Выйти из аккаунта'
                                        onClick={handleLogout}
                                    />
                                ),
                                !isSelf && (
                                    <HasPermission permission='user:delete'>
                                        <IconButton
                                            iconName='bin'
                                            title='Удалить'
                                            onClick={deleteUser}
                                        />
                                    </HasPermission>
                                ),
                            ]
                        ) : (
                            <HasPermission permission='user:restore'>
                                <IconButton
                                    iconName='restore'
                                    title='Восстановить'
                                    onClick={restoreUser}
                                />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <span>
                ФИО: {data.lastname} {data.firstname} {data.secondname}
            </span>
            <span>Комплексов:</span>
            <ul>
                <li>добавлено: {data.created_complexes.length}</li>
                <li>доступно: {data.accessible_complexes.length}</li>
                <li>избранно: {data.favorite_complexes.length}</li>
            </ul>
            <ComponentRowBox
                left={[<span>Роль:</span>, <EntityLabel entity={data.role} type='role' linkable />]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
        </BaseEntityItem>
    );
};
