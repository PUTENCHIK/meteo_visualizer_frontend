import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { RoleForm } from '@forms/role-form';
import { useRole } from '@hooks/roles/use-role';
import { useRoles } from '@hooks/roles/use-roles';

export const EditRoleDialog: React.FC<DialogProps<'edit-role'>> = ({ data }) => {
    const isUpdate = !!data?.roleId;

    const { data: role, isLoading: isSelfLoading, isError: isSelfError } = useRole(data?.roleId);
    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useRoles();

    const isLoading = isSelfLoading || isRolesLoading;
    const isError = isSelfError || isRolesError;

    const parentRoles = roles?.filter((r) => r.id !== role?.id);

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
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить роль</p>}
            {(!isUpdate || role) && parentRoles && (
                <RoleForm role={role} parentRoles={parentRoles} />
            )}
        </BaseDialog>
    );
};
