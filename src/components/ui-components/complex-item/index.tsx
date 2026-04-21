import clsx from 'clsx';
import s from './complex-item.module.scss';
import { EntityLabel } from '@components/entity-label';
import type { ComplexWithFavoriteInfoSchema } from '@utils/schemas';
import { IconButton } from '@components/icon-button';
import { ComponentRowBox } from '@components/component-row-box';
import { useDialogs } from '@context/dialog-context';
import { useDeleteComplex } from '@hooks/api-data/use-delete-complex';
import { ComplexStatusLabel } from '@components/complex-status-label';
import { TimestampLabel } from '@components/timestamp-label';
import { MastItem } from '@components/mast-item';
import { useRestoreComplex } from '@hooks/api-data/use-restore-complex';
import { SecretedLabel } from '@components/secreted-label';
import { useAddComplexToFavorites } from '@hooks/api-data/use-add-complex-to-favorites';
import { useDeleteComplexFromFavorites } from '@hooks/api-data/use-delete-complex-from-favorites';

interface ComplexItemProps {
    data: ComplexWithFavoriteInfoSchema;
}

export const ComplexItem = ({ data }: ComplexItemProps) => {
    const { openDialog } = useDialogs();
    const { mutate: addToFavorite, isPending: favPending } = useAddComplexToFavorites();
    const { mutate: deleteFromFavorite, isPending: unfavPending } = useDeleteComplexFromFavorites();
    const deleteMutation = useDeleteComplex();
    const restoreMutation = useRestoreComplex();

    const isFavorite = data.is_favorite;
    const isDeleted = data.deleted_at !== null;

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
        <div className={clsx(s['complex-item'])}>
            <ComponentRowBox
                left={[<h2>{data.name}</h2>, <EntityLabel entity={data} field='id' />]}
                right={[
                    [
                        data.is_secreted && <SecretedLabel />,
                        <ComplexStatusLabel isPrivate={data.is_private} />,
                    ],
                    [
                        !isDeleted ? (
                            <>
                                <IconButton
                                    iconName={isFavorite ? 'star-full' : 'star'}
                                    title={isFavorite ? 'Не отслеживать' : 'Отслеживать'}
                                    iconColor={isFavorite ? 'yellow' : undefined}
                                    disabled={favPending || unfavPending}
                                    onClick={handleFavoriteClick}
                                />
                                <IconButton
                                    iconName='pencil'
                                    title='Редактировать'
                                    onClick={updateComplex}
                                />
                                <IconButton
                                    iconName='bin'
                                    title='Удалить'
                                    onClick={deleteComplex}
                                />
                            </>
                        ) : (
                            <IconButton
                                iconName='restore'
                                title='Восстановить'
                                onClick={restoreComplex}
                            />
                        ),
                    ],
                ]}
            />
            <span>Адрес TCP: {data.address ?? '-'}</span>
            <span>
                Расположение: {data.latitude} {data.longitude}
            </span>
            <ComponentRowBox
                left={[
                    [
                        <span>Добавил:</span>,
                        data.creator ? <EntityLabel entity={data.creator} /> : 'Система',
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
                            <IconButton
                                iconName='plus'
                                title='Добавить мачту'
                                type='primary'
                                iconSize={16}
                                onClick={() => openDialog('edit-mast', { complex: data })}
                            />,
                        ]}
                    />
                    {data.masts.length === 0 && <span>Нет мачт</span>}
                    {data.masts &&
                        data.masts.map((mast, index) => (
                            <MastItem key={index} data={mast} complex={data} />
                        ))}
                </>
            )}
        </div>
    );
};
