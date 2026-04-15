import clsx from "clsx";
import s from './profile-dialog.module.scss';
import { IconButton } from "@components/icon-button";
import { BaseDialog } from "@dialogs/base-dialog";
import { useAuthStore } from "@stores/auth-store";

export const ProfileDialog = () => {
    const {user, logout} = useAuthStore();

    return (
        <BaseDialog dialogId="profile" title="Профиль">
            <div className={clsx(s['buttons'])}>
                <IconButton iconName="eye" title="Изменить" />
                <IconButton iconName="cross" title="Выйти" onClick={logout} />
            </div>
            {user ? (
                <>
                    <p>{user.lastname} {user.firstname} {user.secondname}</p>
                    <p>По масти: {user.role.name}</p>
                </>
            ) : (
                <p>Профиль не загружен</p>
            )}
        </BaseDialog>
    );
}