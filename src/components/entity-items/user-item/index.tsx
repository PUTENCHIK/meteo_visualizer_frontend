import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { HasPermission } from '@pages/has-permission';
import type { UserWithRoleSchema } from '@utils/schemas';

interface UserItemProps {
    data: UserWithRoleSchema;
}

export const UserItem = ({ data }: UserItemProps) => {

    const isDeleted = data.deleted_at !== null;

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<EntityLabel entity={data} size='big' field='login' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission permission='user:update'>
                                    <IconButton iconName='pencil' title='Редактировать' />
                                </HasPermission>,
                                <HasPermission permission='user:delete'>
                                    <IconButton iconName='bin' title='Удалить' />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='user:restore'>
                                <IconButton iconName='restore' title='Восстановить' />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <span>
                ФИО: {data.lastname} {data.firstname} {data.secondname}
            </span>
            <ComponentRowBox
                left={[<span>Роль:</span>, <EntityLabel entity={data.role} />]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
        </BaseEntityItem>
    );
};
