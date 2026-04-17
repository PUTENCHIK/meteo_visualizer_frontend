import clsx from 'clsx';
import s from './profile-dialog.module.scss';
import { IconButton } from '@components/icon-button';
import { BaseDialog } from '@dialogs/base-dialog';
import { useAuthStore } from '@stores/auth-store';
import { EntityLabel } from '@components/entity-label';
import { dateFormatter } from '@utils/common';
import { ComponentHeader } from '@components/component-header';

export const ProfileDialog = () => {
    const { user, logout } = useAuthStore();

    return (
        <BaseDialog dialogId='profile' title='Профиль'>
            <ComponentHeader
                right={[
                    <IconButton iconName='pencil' title='Изменить' iconSize={16} />,
                    <IconButton iconName='logout' title='Выйти' onClick={logout} iconSize={16} />,
                ]}
                size='tiny'
            />
            {user ? (
                <div className={clsx(s['fields'])}>
                    <span>
                        ФИО: {user.lastname} {user.firstname} {user.secondname}
                    </span>
                    <span>Логин: {user.login}</span>
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
