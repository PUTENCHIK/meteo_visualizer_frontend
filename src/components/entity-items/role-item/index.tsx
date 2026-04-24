import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { HasPermission } from '@pages/has-permission';
import type { RoleWithPermissionsSchema } from '@utils/schemas';

interface RoleItemProps {
    data: RoleWithPermissionsSchema;
}

export const RoleItem = ({ data }: RoleItemProps) => {
    const isDeleted = data.deleted_at !== null;

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<EntityLabel entity={data} size='big' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission permission='role:update'>
                                    <IconButton iconName='pencil' title='Редактировать' />
                                </HasPermission>,
                                <HasPermission permission='role:delete'>
                                    <IconButton iconName='bin' title='Удалить' />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='role:restore'>
                                <IconButton iconName='restore' title='Восстановить' />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <ComponentRowBox
                left={
                    data.parent !== null
                        ? [<span>Родительская роль:</span>, <EntityLabel entity={data.parent} />]
                        : undefined
                }
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
            <h3>Разрешения</h3>
            {data.permissions.length > 0 && (
                <ol>
                    {data.permissions.map((permission, index) => (
                        <li key={index}>{permission.name}</li>
                    ))}
                </ol>
            )}
        </BaseEntityItem>
    );
};
