import { ComponentRowBox } from "@components/component-row-box";
import { InputLabel } from "@components/input-label";
import { Loader } from "@components/loader";
import { Toggle } from "@components/toggle";
import { UserItem } from "@entity-items/user-item";
import { useUsers } from "@hooks/users/use-users";
import { HolyGrailLayout } from "@pages/holy-grail-layout"
import { useState } from "react";

export const UsersPage = () => {
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const {data: users, isLoading, isError} = useUsers(includeDeleted);

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Пользователи</h1>]}
                right={[
                    <InputLabel label='удалённые' orientation='horizontal'>
                        <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                    </InputLabel>,
                ]}
                size='big'
            />
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить пользователей</p>}
            {users && (
                <>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <UserItem key={index} data={user} />
                        ))
                    ) : (
                        <p>Нет пользователей в базе</p>
                    )}
                </>
            )}
        </HolyGrailLayout>
    );
}