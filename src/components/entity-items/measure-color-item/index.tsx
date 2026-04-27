import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useDeleteMeasureColor } from '@hooks/measure-colors/use-delete-measure-color';
import { HasPermission } from '@pages/has-permission';
import type { MeasureColorSchema, MeasureWithDependentsSchema } from '@utils/schemas';

interface MeasureColorItemProps {
    data: MeasureColorSchema;
    measure: MeasureWithDependentsSchema;
}

export const MeasureColorItem = ({ data, measure }: MeasureColorItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteMeasureColor();

    const updateMeasureColor = () => {
        openDialog('edit-measure-color', { measure, colorId: data.id });
    };

    const deleteMeasureColor = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: data.id });
            },
            extra: {
                entityName: 'Цвет параметра',
                entity: data,
            },
        });
    };

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<span>Цвет</span>, <EntityLabel entity={data} />]}
                right={[
                    <HasPermission permission='measure_color:create'>
                        <IconButton
                            iconName='pencil'
                            title='Редактировать'
                            iconSize={16}
                            onClick={updateMeasureColor}
                        />
                    </HasPermission>,
                    <HasPermission permission='measure_color:delete'>
                        <IconButton
                            iconName='bin'
                            title='Удалить'
                            iconSize={16}
                            onClick={deleteMeasureColor}
                        />
                    </HasPermission>,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<span>Значение: </span>, <input type='color' value={data.value} readOnly />]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<span>Процент: {data.percent * 100}%</span>]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                ]}
                size='tiny'
            />
        </BaseEntityItem>
    );
};
