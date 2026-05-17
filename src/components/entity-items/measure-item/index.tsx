import clsx from 'clsx';
import s from './measure-item.module.scss';
import { ComponentColumnsBox } from '@components/component-columns-box';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { TimestampLabel } from '@components/timestamp-label';
import { useDialogs } from '@context/dialog-context';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { MeasureAliasItem } from '@entity-items/measure-alias-item';
import { MeasureColorItem } from '@entity-items/measure-color-item';
import { useDeleteMeasure } from '@hooks/measures/use-delete-measure';
import { useRestoreMeasure } from '@hooks/measures/use-restore-measure';
import { HasPermission } from '@pages/has-permission';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import { MAX_MEASURE_COLORS } from '@utils/common';

interface MeasureItemProps {
    data: MeasureWithDependentsSchema;
}

export const MeasureItem = ({ data }: MeasureItemProps) => {
    const { openDialog } = useDialogs();
    const deleteMutation = useDeleteMeasure();
    const restoreMutation = useRestoreMeasure();

    const isMaxColors = data.colors.length >= MAX_MEASURE_COLORS;

    const updateMeasure = () => {
        openDialog('edit-measure', { measureId: data.id });
    };

    const deleteMeasure = () => {
        openDialog('confirm-delete', {
            mode: 'both',
            onSubmit: async (force) => {
                await deleteMutation.mutateAsync({ id: data.id, force });
            },
            extra: {
                entityName: 'Пользовательский параметр',
                entity: data,
            },
        });
    };

    const restoreMeasure = () => {
        openDialog('confirm-restore', {
            extra: {
                entityName: 'Пользовательский параметр',
                entity: data,
            },
            onSubmit: async () => {
                await restoreMutation.mutateAsync({ id: data.id });
            },
        });
    };

    const isDeleted = data.deleted_at !== null;

    return (
        <BaseEntityItem deleted={isDeleted}>
            <ComponentRowBox
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} field='id' />]}
                right={[
                    [
                        !isDeleted ? (
                            [
                                <HasPermission permission='measure:update'>
                                    <IconButton
                                        iconName='pencil'
                                        title='Редактировать'
                                        onClick={updateMeasure}
                                    />
                                </HasPermission>,
                                <HasPermission permission='measure:delete'>
                                    <IconButton
                                        iconName='bin'
                                        title='Удалить'
                                        onClick={deleteMeasure}
                                    />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='measure:restore'>
                                <IconButton
                                    iconName='restore'
                                    title='Восстановить'
                                    onClick={restoreMeasure}
                                />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <span>
                Шкала: [{data.min}; {data.max}]
            </span>
            <span>Обозначение единицы измерения: {data.units}</span>
            <ComponentRowBox
                left={[
                    <span>Добавил:</span>,
                    <EntityLabel entity={data.creator} type='user' linkable />,
                ]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
            {(data.aliases.length < 1 || data.colors.length < 2) && (
                <div className={clsx(s['warning'])}>
                    Параметр нельзя будет использовать до добавления хотя бы 2 цветов и 1 псевдонима
                </div>
            )}
            {!isDeleted && (
                <ComponentColumnsBox>
                    <>
                        <ComponentRowBox
                            left={[<h3>Цвета</h3>]}
                            right={[
                                <HasPermission permission='measure_color:create'>
                                    <IconButton
                                        iconName='plus'
                                        title={
                                            isMaxColors
                                                ? `Максимум ${MAX_MEASURE_COLORS} цветов`
                                                : 'Добавить цвет'
                                        }
                                        type='primary'
                                        iconSize={'small'}
                                        disabled={isMaxColors}
                                        onClick={() =>
                                            openDialog('edit-measure-color', { measure: data })
                                        }
                                    />
                                </HasPermission>,
                            ]}
                        />
                        {data.colors.length === 0 && <span>Нет цветов</span>}
                        {data.colors &&
                            data.colors.map((color, index) => (
                                <MeasureColorItem key={index} data={color} measure={data} />
                            ))}
                    </>
                    <>
                        <ComponentRowBox
                            left={[<h3>Псевдонимы</h3>]}
                            right={[
                                <HasPermission permission='measure_alias:create'>
                                    <IconButton
                                        iconName='plus'
                                        title='Добавить псевдоним'
                                        type='primary'
                                        iconSize={'small'}
                                        onClick={() =>
                                            openDialog('edit-measure-alias', { measure: data })
                                        }
                                    />
                                </HasPermission>,
                            ]}
                        />
                        {data.aliases.length === 0 && <span>Нет псевдонимов</span>}
                        {data.aliases &&
                            data.aliases.map((alias, index) => (
                                <MeasureAliasItem key={index} data={alias} measure={data} />
                            ))}
                    </>
                </ComponentColumnsBox>
            )}
        </BaseEntityItem>
    );
};
