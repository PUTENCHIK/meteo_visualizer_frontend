import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { IconButton } from '@components/icon-button';
import { BaseEntityItem } from '@entity-items/base-entity-item';
import { useFocus } from '@hooks/use-focus';
import { useComplexStore } from '@stores/complex-store';
import type { WeatherStationData } from '@stores/devices-store';
import type { Guid } from 'typescript-guid';

interface WeatherStationItemProps {
    data: WeatherStationData;
    mastId: Guid;
}

export const WeatherStationItem = ({ data, mastId }: WeatherStationItemProps) => {
    const { focusStation } = useFocus();
    const { measure } = useComplexStore();

    const devices = Object.entries(data.devices);

    return (
        <BaseEntityItem>
            <ComponentRowBox
                left={[<span>Метеостанция</span>, <EntityLabel entity={data} />]}
                right={[
                    <IconButton
                        iconName='eye'
                        title='Фокус'
                        iconSize={16}
                        onClick={() => focusStation(data.id, mastId)}
                    />,
                ]}
                size='tiny'
            />
            {devices.length > 0 ? (
                <ol>
                    {devices.map(([name, deviceData], index) => (
                        <li key={index}>
                            {name}: {deviceData.data.at(-1)?.value.toFixed(2) ?? '-'}
                            {measure?.units}
                        </li>
                    ))}
                </ol>
            ) : (
                <span>Датчиков нет</span>
            )}
        </BaseEntityItem>
    );
};
