import clsx from 'clsx';
import s from './profile-dialog.module.scss';
import { IconButton } from '@components/icon-button';
import { BaseDialog } from '@dialogs/base-dialog';
import { useAuthStore } from '@stores/auth-store';
import { EntityLabel } from '@components/entity-label';
import { ComponentRowBox } from '@components/component-row-box';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { useDialogs } from '@context/dialog-context';
import { TimestampLabel } from '@components/timestamp-label';

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
                    <ComponentRowBox
                        left={[
                            <span>Роль:</span>,
                            <EntityLabel entity={user.role} />
                        ]}
                        size='tiny'
                    />
                    <span>Доступно комплексов: {user.accessible_complexes.length}</span>
                    <span>Избранных комплексов: {user.favorite_complexes.length}</span>
                    <span>Добавлено комплексов: {user.created_complexes.length}</span>
                    <ComponentRowBox
                        left={[
                            <span>Зарегистрирован:</span>,
                            <TimestampLabel value={user.created_at} />
                        ]}
                        size='tiny'
                    />
                    <h3>Разрешения:</h3>
                    {user.role.permissions.length > 0 ? (
                        <ol>
                            {
                                user.role.permissions.map((p) => (
                                    <li>{p.name}</li>
                                ))
                            }
                        </ol>
                    ): (
                        <span>Разрешений нет</span>
                    )}
                </div>
            ) : (
                <span>Профиль не загружен</span>
            )}
        </BaseDialog>
    );
};
