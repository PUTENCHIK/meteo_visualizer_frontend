import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { UserForm } from '@forms/user-form';
import { useUser } from '@hooks/users/use-user';

export const EditUserDialog: React.FC<DialogProps<'edit-user'>> = ({ data }) => {
    const isUpdate = !!data?.userId;

    const { data: user, isLoading, isError } = useUser(data?.userId);

    return (
        <BaseDialog
            dialogId='edit-user'
            title={
                isUpdate ? (
                    <>
                        <h2>Пользователь</h2>
                        {!!user && <EntityLabel entity={user} />}
                    </>
                ) : (
                    'Добавление пользователя'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплекс</p>}
            {(!isUpdate || user) && <UserForm user={user} />}
        </BaseDialog>
    );
};
