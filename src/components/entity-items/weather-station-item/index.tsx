import clsx from 'clsx';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useFocus } from '@hooks/use-focus';
import { useComplexStore } from '@stores/complex-store';
import { DevicesStore, type WeatherStationData } from '@stores/devices-store';
import type { Guid } from 'typescript-guid';

interface WeatherStationItemProps {
    mastId: Guid;
    yardHeight: number;
    num: number;
    devices?: WeatherStationData['devices'];
}

export const WeatherStationItem = ({
    mastId,
    yardHeight,
    num,
    devices: devicesMap = {},
}: WeatherStationItemProps) => {
    const { focusStation } = useFocus();
    const { measure } = useComplexStore();

    const id = DevicesStore.getStationId(mastId, yardHeight, num);
    const devices = Object.entries(devicesMap);

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<span>Метеостанция</span>, <EntityLabel entity={{ id: id }} />]}
                right={[
                    <IconButton
                        iconName='eye'
                        title='Фокус'
                        iconSize={'small'}
                        onClick={() => focusStation(id, mastId)}
                    />,
                ]}
                size='tiny'
            />
            <span className={clsx('no-wrap')}>
                Высота: {yardHeight} м; Номер: {num}
            </span>
            {devices.length > 0 ? (
                <>
                    <span>Датчики:</span>
                    <ol>
                        {devices.map(([name, deviceData], index) => (
                            <li key={index}>
                                <ComponentRowBox
                                    left={[
                                        <span className={clsx('no-wrap')}>{name}:</span>,
                                        <span>
                                            {deviceData.data.at(-1)?.value.toFixed(2) ?? '-'}
                                            {measure?.units}
                                        </span>,
                                    ]}
                                    size='tiny'
                                    wrap={false}
                                />
                            </li>
                        ))}
                    </ol>
                </>
            ) : (
                <span className={clsx('no-wpap')}>Датчиков нет</span>
            )}
        </BaseEntityItem>
    );
};
