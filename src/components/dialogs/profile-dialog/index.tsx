import { BaseDialog } from '@dialogs/base-dialog';
import { useAuthStore } from '@stores/auth-store';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { UserItem } from '@entity-items/user-item';
import { useUser } from '@hooks/users/use-user';
import { Loader } from '@components/loader';

export const ProfileDialog: React.FC<DialogProps<'profile'>> = () => {
    const { user } = useAuthStore();
    const { data, isLoading, isError } = useUser(user?.id);

    return (
        <BaseDialog dialogId='profile' title='Профиль'>
            {isLoading && <Loader />}
            {isError && <span>Не удалось загрузить данные пользователя</span>}
            {!isLoading &&
                !isError &&
                (data ? (
                    <UserItem data={data} profile />
                ) : (
                    <span>На удивление, вас не существует</span>
                ))}
        </BaseDialog>
    );
};
