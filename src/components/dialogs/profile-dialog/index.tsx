import clsx from 'clsx';
import s from './profile-dialog.module.scss';
import { IconButton } from '@components/icon-button';
import { BaseDialog } from '@dialogs/base-dialog';
import { useAuthStore } from '@stores/auth-store';
import { EntityLabel } from '@components/entity-label';
import { dateFormatter } from '@utils/common';
import { ComponentRowBox } from '@components/component-row-box';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { useDialogs } from '@context/dialog-context';

export const ProfileDialog: React.FC<DialogProps<'profile'>> = () => {
    const { user, logout } = useAuthStore();
    const { closeAllDialogs } = useDialogs();

    const handleLogout = async () => {
        await logout();
        closeAllDialogs();
    };

    return (
        <BaseDialog dialogId='profile' title='Профиль'>
            {user ? (
                <div className={clsx(s['fields'])}>
                    <ComponentRowBox
                        left={[<EntityLabel entity={user} size='big' field='login' />]}
                        right={[
                            <IconButton iconName='pencil' title='Изменить' iconSize={16} />,
                            <IconButton
                                iconName='logout'
                                title='Выйти'
                                onClick={handleLogout}
                                iconSize={16}
                            />,
                        ]}
                        size='tiny'
                    />
                    <span>
                        ФИО: {user.lastname} {user.firstname} {user.secondname}
                    </span>
                    <span className={clsx(s['no-wrap'])}>
                        Роль: <EntityLabel entity={user.role} />
                    </span>
                    <span>Доступно комплексов: {user.complexes.length}</span>
                    <span>Добавлено комплексов: {user.created_complexes.length}</span>
                    <span>Зарегистрирован: {dateFormatter.format(new Date(user.created_at))}</span>
                </div>
            ) : (
                <span>Профиль не загружен</span>
            )}
        </BaseDialog>
    );
};
