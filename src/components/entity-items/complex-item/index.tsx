import { EntityLabel } from '@components/entity-label';
import type { ComplexWithFavoriteInfoSchema } from '@utils/schemas';
import { IconButton } from '@components/icon-button';
import { ComponentRowBox } from '@components/component-row-box';
import { useDialogs } from '@context/dialog-context';
import { useDeleteComplex } from '@hooks/complexes/use-delete-complex';
import { ComplexStatusLabel } from '@components/complex-status-label';
import { TimestampLabel } from '@components/timestamp-label';
import { MastItem } from '@entity-items/mast-item';
import { useRestoreComplex } from '@hooks/complexes/use-restore-complex';
import { SecretedLabel } from '@components/secreted-label';
import { useAddComplexToFavorites } from '@hooks/complexes/use-add-complex-to-favorites';
import { useDeleteComplexFromFavorites } from '@hooks/complexes/use-delete-complex-from-favorites';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { GeographicInput } from '@components/geographic-input';
import { HasPermission } from '@pages/has-permission';
import { useMemo } from 'react';

interface ComplexItemProps {
    data: ComplexWithFavoriteInfoSchema;
    focusable?: boolean;
}

export const ComplexItem = ({ data, focusable = false }: ComplexItemProps) => {
    const { openDialog } = useDialogs();
    const { mutate: addToFavorite, isPending: favPending } = useAddComplexToFavorites();
    const { mutate: deleteFromFavorite, isPending: unfavPending } = useDeleteComplexFromFavorites();
    const deleteMutation = useDeleteComplex();
    const restoreMutation = useRestoreComplex();

    const isFavorite = data.is_favorite;
    const isDeleted = data.deleted_at !== null;

    const favoriteColor = useMemo(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue('--favorite-color').trim();
    }, []);

    const handleFavoriteClick = () => {
        if (isFavorite) {
            deleteFromFavorite({ complexId: data.id });
        } else {
            addToFavorite({ complexId: data.id });
        }
    };

    const updateComplex = () => {
        openDialog('edit-complex', { complexId: data.id });
    };

    const deleteComplex = () => {
        openDialog('confirm-delete', {
            mode: 'both',
            onSubmit: async (force) => {
                await deleteMutation.mutateAsync({ id: data.id, force });
            },
            extra: {
                entityName: 'Комплекс',
                entity: data,
            },
        });
    };

    const restoreComplex = () => {
        openDialog('confirm-restore', {
            extra: {
                entityName: 'Комплекс',
                entity: data,
            },
            onSubmit: async () => {
                await restoreMutation.mutateAsync({ id: data.id });
            },
        });
    };

    return (
        <BaseEntityItem isDeleted={isDeleted}>
            <ComponentRowBox
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} field='id' />]}
                right={[
                    [
                        data.is_secreted && <SecretedLabel />,
                        <ComplexStatusLabel isPrivate={data.is_private} />,
                    ],
                    [
                        !isDeleted ? (
                            [
                                <HasPermission
                                    allOf={['complex_favorite:create', 'complex_favorite:delete']}>
                                    <IconButton
                                        iconName={isFavorite ? 'star-full' : 'star'}
                                        title={isFavorite ? 'Не отслеживать' : 'Отслеживать'}
                                        iconColor={isFavorite ? favoriteColor : undefined}
                                        disabled={favPending || unfavPending}
                                        onClick={handleFavoriteClick}
                                    />
                                </HasPermission>,
                                <HasPermission permission='complex:update'>
                                    <IconButton
                                        iconName='pencil'
                                        title='Редактировать'
                                        onClick={updateComplex}
                                    />
                                </HasPermission>,
                                <HasPermission permission='complex:delete'>
                                    <IconButton
                                        iconName='bin'
                                        title='Удалить'
                                        onClick={deleteComplex}
                                    />
                                </HasPermission>,
                            ]
                        ) : (
                            <HasPermission permission='complex:restore'>
                                <IconButton
                                    iconName='restore'
                                    title='Восстановить'
                                    onClick={restoreComplex}
                                />
                            </HasPermission>
                        ),
                    ],
                ]}
            />
            <span>Адрес TCP: {data.address ?? '-'}</span>
            <ComponentRowBox
                left={[<span>Расположение:</span>]}
                right={[
                    <GeographicInput value={data.latitude} param='lat' readOnly />,
                    <GeographicInput value={data.longitude} param='lon' readOnly />,
                ]}
                size='tiny'
                wrap={false}
            />
            <ComponentRowBox
                left={[
                    [
                        <span>Добавил:</span>,
                        <EntityLabel entity={data.creator} type='user' linkable />,
                    ],
                ]}
                right={[
                    <TimestampLabel value={data.created_at} />,
                    <TimestampLabel value={data.updated_at} />,
                    data.deleted_at !== null && <TimestampLabel value={data.deleted_at} deleted />,
                ]}
                size='tiny'
            />
            {!isDeleted && (
                <>
                    <ComponentRowBox
                        left={[<h3>Мачты</h3>]}
                        right={[
                            <HasPermission permission='mast:create'>
                                <IconButton
                                    iconName='plus'
                                    title='Добавить мачту'
                                    type='primary'
                                    iconSize={16}
                                    onClick={() => openDialog('edit-mast', { complex: data })}
                                />
                            </HasPermission>,
                        ]}
                    />
                    {data.masts.length === 0 && <span>Нет мачт</span>}
                    {data.masts &&
                        data.masts.map((mast, index) => (
                            <MastItem
                                key={index}
                                mast={mast}
                                complex={data}
                                focusable={focusable}
                            />
                        ))}
                </>
            )}
        </BaseEntityItem>
    );
};
