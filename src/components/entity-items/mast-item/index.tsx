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
import { useFocus } from '@hooks/use-focus';
import type { MastData } from '@stores/devices-store';
import { useState } from 'react';
import { WeatherStationItem } from '@entity-items/weather-station-item';

interface MastItemProps {
    mast: MastSchema;
    complex: ComplexWithCreatorSchema;
    data?: MastData;
    focusable?: boolean;
}

export const MastItem = ({ mast, complex, data, focusable = false }: MastItemProps) => {
    const { openDialog } = useDialogs();
    const { focusMast } = useFocus();
    const deleteMutation = useDeleteMast();

    const [showData, setShowData] = useState(false);
    const isDeleted = mast.deleted_at !== null;

    const updateMast = () => {
        openDialog('edit-mast', { complex: complex, mastId: mast.id });
    };

    const deleteMast = () => {
        openDialog('confirm-delete', {
            mode: 'hard',
            onSubmit: async () => {
                await deleteMutation.mutateAsync({ id: mast.id });
            },
            extra: {
                entityName: 'Мачта',
                entity: mast,
            },
        });
    };

    return (
        <BaseEntityItem isDeleted={isDeleted}>
            <ComponentRowBox
                left={[<span>Мачта</span>, <EntityLabel entity={mast} />]}
                right={[
                    focusable && (
                        <IconButton
                            iconName='eye'
                            title='Фокус'
                            iconSize={16}
                            onClick={() => focusMast(mast.id)}
                        />
                    ),
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
                    <EntityLabel entity={mast.config} type='mast-config' linkable />,
                ]}
                size='tiny'
            />
            <span>Префикс мачты: {mast.prefix}</span>
            <ComponentRowBox
                left={[<span>Расположение:</span>]}
                right={[
                    <GeographicInput value={mast.latitude} param='lat' readOnly />,
                    <GeographicInput value={mast.longitude} param='lon' readOnly />,
                ]}
                size='tiny'
            />
            <ComponentRowBox
                left={[<span>Угол поворота: {mast.rotation}</span>]}
                right={[
                    <TimestampLabel value={mast.created_at} />,
                    <TimestampLabel value={mast.updated_at} />,
                ]}
                size='tiny'
            />
            {data && (
                <>
                    <ComponentRowBox
                        left={[<span>Метеостанции</span>]}
                        right={[
                            <IconButton
                                iconName='checron'
                                title={showData ? 'Свернуть' : 'Развернуть'}
                                iconRotate={showData ? -90 : 90}
                                iconSize={16}
                                onClick={() => setShowData((prev) => !prev)}
                            />,
                        ]}
                    />
                    {showData &&
                        Object.values(data).map((station, index) => (
                            <WeatherStationItem
                                key={index}
                                mastId={mast.id}
                                yardHeight={station.height}
                                num={station.num}
                                devices={station.devices}
                            />
                        ))}
                </>
            )}
        </BaseEntityItem>
    );
};
