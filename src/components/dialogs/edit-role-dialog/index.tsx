import { EntityLabel } from '@components/entity-label';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { TabsMenu } from '@components/tabs-menu';
import { Toggle } from '@components/toggle';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { RoleForm } from '@forms/role-form';
import { useAddPermissionToRole } from '@hooks/roles/use-add-permission-to-role';
import { useDeletePermissionFromRole } from '@hooks/roles/use-delete-permission-from-role';
import { useRole } from '@hooks/roles/use-role';
import { useRolePermissions } from '@hooks/roles/use-role-permissions';
import { useRoles } from '@hooks/roles/use-roles';
import type { SystemPermission } from '@utils/http';
import type { PermissionWithRoleInfoSchema } from '@utils/schemas';
import { useState } from 'react';

export const EditRoleDialog: React.FC<DialogProps<'edit-role'>> = ({ data }) => {
    const isUpdate = !!data?.roleId;
    const { mutate: addPermission, isPending: isAddPending } = useAddPermissionToRole();
    const { mutate: deletePermission, isPending: isDeletePending } = useDeletePermissionFromRole();

    const { data: role, isLoading: isSelfLoading, isError: isSelfError } = useRole(data?.roleId);
    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useRoles();
    const {
        data: permissions,
        isLoading: isPermissionsLoading,
        isError: isPermissionsError,
    } = useRolePermissions(data?.roleId);

    const [currentTab, setCurrentTab] = useState<keyof typeof tabs>('base');
    const tabs = {
        base: 'Поля',
        permissions: 'Разрешения',
    };

    const isFieldsLoading = isSelfLoading || isRolesLoading;
    const isFieldsError = isSelfError || isRolesError;

    const parentRoles = roles?.filter((r) => r.id !== role?.id);

    const handlePermissionChanged = (permission: PermissionWithRoleInfoSchema, value: boolean) => {
        if (data?.roleId) {
            if (value) {
                addPermission({
                    roleId: data?.roleId,
                    permission: permission.name as SystemPermission,
                });
            } else {
                deletePermission({
                    roleId: data?.roleId,
                    permission: permission.name as SystemPermission,
                });
            }
        }
    };

    return (
        <BaseDialog
            dialogId='edit-role'
            title={
                isUpdate ? (
                    <>
                        <h2>Роль</h2>
                        {!!role && <EntityLabel entity={role} field='id' />}
                    </>
                ) : (
                    'Добавление роли'
                )
            }
            hardClose>
            {isUpdate && <TabsMenu current={currentTab} tabs={tabs} onChange={setCurrentTab} />}
            {currentTab === 'base' && (
                <>
                    {isFieldsLoading && <Loader />}
                    {isFieldsError && <p>Не удалось загрузить роль</p>}
                    {(!isUpdate || role) && parentRoles && (
                        <RoleForm role={role} parentRoles={parentRoles} />
                    )}
                </>
            )}
            {currentTab === 'permissions' && (
                <>
                    {isPermissionsLoading && <Loader />}
                    {isPermissionsError && <p>Не удалось загрузить разрешения</p>}
                    {isUpdate && permissions ? (
                        permissions.length > 0 ? (
                            permissions.map((permission, index) => (
                                <InputLabel
                                    key={index}
                                    label={permission.name}
                                    orientation='horizontal'
                                    reverse
                                    nowrap>
                                    <Toggle
                                        value={permission.is_relative}
                                        onChange={(value) =>
                                            handlePermissionChanged(permission, value)
                                        }
                                        disabled={isAddPending || isDeletePending}
                                    />
                                </InputLabel>
                            ))
                        ) : (
                            <span>Нет разрешений в приложении</span>
                        )
                    ) : (
                        <span>Нельзя редактировать разрешения при создании</span>
                    )}
                </>
            )}
        </BaseDialog>
    );
};
