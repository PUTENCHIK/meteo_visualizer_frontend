import { useSceneSettings } from '@hooks/use-scene-settings';
import { SphereMesh } from '@models_/sphere-mesh';
import { Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { useFocus } from '@hooks/use-focus';
import type { Guid } from 'typescript-guid';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { devicesStore, DevicesStore, useStationData } from '@stores/devices-store';
import { useBridge } from '@context/bridge-context';
import { WeatherStationItem } from '@entity-items/weather-station-item';
import { useComplexStore } from '@stores/complex-store';
import { getColorAtPercent } from '@utils/common';

type DocumentCursor = 'default' | 'pointer';

interface WeatherStationModelProps {
    position: Vector3;
    mastId: Guid;
    yardHeight: number;
    num: number;
}

export const WeatherStationModel = ({
    position,
    mastId,
    yardHeight,
    num,
}: WeatherStationModelProps) => {
    const { map: settings } = useSceneSettings();
    const { focusStation } = useFocus();
    const { Bridge } = useBridge();
    const { measure } = useComplexStore();

    const meshRef = useRef<Mesh>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [documentCursor, setDocumentCursor] = useState<DocumentCursor>('default');

    const id = useMemo(
        () => DevicesStore.getStationId(mastId, yardHeight, num),
        [mastId, yardHeight, num],
    );
    const stationData = useStationData(mastId, id);

    const getColor = () => {
        if (!measure || !stationData) return settings.model.weatherStation.color;
        const colors = measure.colors;
        const values = Object.values(stationData.devices)
            .map((device) => device.data.at(-1)?.value)
            .filter((v) => v !== undefined);
        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        const value = (average - measure.min) / (measure.max - measure.min);

        return getColorAtPercent(colors, value);
    };

    useEffect(() => {
        if (meshRef.current) {
            const worldPosition = new Vector3();
            meshRef.current.getWorldPosition(worldPosition);

            devicesStore.setStationPosition(mastId, yardHeight, num, worldPosition);
        }
    }, [mastId, yardHeight, num, position]);

    useEffect(() => {
        document.body.style.cursor = documentCursor;
    }, [documentCursor]);

    const handleStationClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!showInfo) focusStation(id, mastId);
        setShowInfo((prev) => !prev);
    };

    return (
        <>
            {showInfo && (
                <Html
                    distanceFactor={14}
                    position={[position.x + (num === 1 ? -1 : 1) * 3, position.y, position.z]}
                    center
                    occlude={settings.model.weatherStation.occludeInfoBox}
                    style={{}}
                    zIndexRange={[0, 10]}>
                    <Bridge>
                        <WeatherStationItem
                            mastId={mastId}
                            yardHeight={yardHeight}
                            num={num}
                            devices={stationData?.devices}
                        />
                    </Bridge>
                </Html>
            )}
            <SphereMesh
                name={id.toString()}
                radius={settings.model.weatherStation.radius}
                position={position}
                color={getColor()}
                onClick={handleStationClick}
                onPointerOver={() => setDocumentCursor('pointer')}
                onPointerOut={() => setDocumentCursor('default')}
                ref={meshRef}
            />
        </>
    );
};
