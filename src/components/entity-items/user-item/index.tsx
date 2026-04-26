import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { HasPermission } from '@pages/has-permission';
import type { UserWithComplexesSchema } from '@utils/schemas';

interface UserItemProps {
    data: UserWithComplexesSchema;
}

export const UserItem = ({ data }: UserItemProps) => {

    const isDeleted = data.deleted_at !== null;

    return (
        <BaseEntityItem isDeleted={isDeleted}>
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
            <span>Комплексов</span>
            <ul>
                <li>добавлено: {data.created_complexes.length}</li>
                <li>доступно: {data.accessible_complexes.length}</li>
                <li>избранно: {data.favorite_complexes.length}</li>
            </ul>
            <ComponentRowBox
                left={[<span>Роль:</span>, <EntityLabel entity={data.role} type='role' linkable />]}
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
