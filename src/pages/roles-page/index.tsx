import { Button } from '@components/button';
import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { Toggle } from '@components/toggle';
import { useDialogs } from '@context/dialog-context';
import { RoleItem } from '@entity-items/role-item';
import { useRoles } from '@hooks/roles/use-roles';
import { HasPermission } from '@pages/has-permission';
import { HolyGrailLayout } from '@pages/holy-grail-layout';
import { useState } from 'react';

export const RolesPage = () => {
    const { openDialog } = useDialogs();
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const { data: roles, isLoading, isError } = useRoles(includeDeleted);

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Роли пользователей</h1>]}
                right={[
                    <InputLabel label='удалённые' orientation='horizontal'>
                        <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                    </InputLabel>,
                    <HasPermission permission='role:create'>
                        <Button
                            title='Добавить роль'
                            type='primary'
                            disabled={isLoading}
                            onClick={() => openDialog('edit-role')}
                        />
                    </HasPermission>,
                ]}
                size='big'
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить роли</p>}
            {roles && (
                <>
                    {roles.length === 0 && <p>Нет конфигов в базе</p>}
                    {roles && roles.map((role, index) => <RoleItem key={index} data={role} />)}
                </>
            )}
        </HolyGrailLayout>
    );
};
