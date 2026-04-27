import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useDeleteMeasureAlias } from '@hooks/measure-aliases/use-delete-measure-alias';
import { HasPermission } from '@pages/has-permission';
import type { MeasureAliasSchema, MeasureWithDependentsSchema } from '@utils/schemas';

interface MeasureAliasItemProps {
    data: MeasureAliasSchema;
    measure: MeasureWithDependentsSchema;
}

export const MeasureAliasItem = ({ data, measure }: MeasureAliasItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteMeasureAlias();

    const updateMeasureAlias = () => {
        openDialog('edit-measure-alias', { measure, aliasId: data.id });
    };

    const deleteMeasureAlias = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Псевдоним параметра',
                entity: data,
            },
        });
    };

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<span>Псевдоним</span>, <EntityLabel entity={data} />]}
                right={[
                    <HasPermission permission='measure_alias:update'>
                        <IconButton
                            iconName='pencil'
                            title='Редактировать'
                            iconSize={16}
                            onClick={updateMeasureAlias}
                        />
                    </HasPermission>,
                    <HasPermission permission='measure_alias:delete'>
                        <IconButton
                            iconName='bin'
                            title='Удалить'
                            iconSize={16}
                            onClick={deleteMeasureAlias}
                        />
                    </HasPermission>,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
        </BaseEntityItem>
    );
};
