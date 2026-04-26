import type { ComplexWithCreatorSchema, MastSchema } from '@utils/schemas';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { useDeleteMast } from '@hooks/masts/use-delete-mast';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { GeographicInput } from '@components/geographic-input';
import { HasPermission } from '@pages/has-permission';

interface MastItemProps {
    data: MastSchema;
    complex: ComplexWithCreatorSchema;
}

export const MastItem = ({ data, complex }: MastItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteMast();

    const isDeleted = data.deleted_at !== null;

    const updateMast = () => {
        openDialog('edit-mast', { complex: complex, mastId: data.id });
    };

    const deleteMast = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Мачта',
                entity: data,
            },
        });
    };

    return (
        <BaseEntityItem isDeleted={isDeleted}>
            <ComponentRowBox
                left={[<span>Мачта</span>, <EntityLabel entity={data} />]}
                right={[
                    <HasPermission permission='mast:update'>
                        <IconButton
                            iconName='pencil'
                            title='Редактировать'
                            iconSize={16}
                            onClick={updateMast}
                        />
                    </HasPermission>,
                    <HasPermission permission='mast:delete'>
                        <IconButton
                            iconName='bin'
                            title='Удалить'
                            iconSize={16}
                            onClick={deleteMast}
                        />
                    </HasPermission>,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[
                    <span>Конфиг:</span>,
                    <EntityLabel entity={data.config} type='mast-config' linkable />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[
                    <span>Расположение:</span>,
                ]}
                right={[
                    <GeographicInput value={data.latitude} param='lat' readOnly />,
                    <GeographicInput value={data.longitude} param='lon' readOnly />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<span>Угол поворота: {data.rotation}</span>]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
        </BaseEntityItem>
    );
};
