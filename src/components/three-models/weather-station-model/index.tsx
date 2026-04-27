// import clsx from 'clsx';
// import s from './weather-station-model.module.scss';
import { useSettings } from '@context/use-settings';
import { SphereMesh } from '@models_/sphere-mesh';
// import { Html } from '@react-three/drei';
import type { WeatherStationsNum } from '@utils/complexes';
import { Mesh, Vector3 } from 'three';
// import { GuidLabel } from '@components/guid-label';
// import { IconButton } from '@components/icon-button';
// import { useBridge } from '@context/bridge-context';
// import { useFocus } from '@hooks/use-focus';
import type { Guid } from 'typescript-guid';
// import { useComplexStore } from '@stores/complex-store';
// import { useDeviceData } from '@stores/devices-store';
import { useRef } from 'react';
// import type { ThreeEvent } from '@react-three/fiber';

interface WeatherStationModelProps {
    position: Vector3;
    mastId: Guid;
    yardHeight: number;
    num: WeatherStationsNum;
}

export const WeatherStationModel = ({
    position,
    // mastId,
    // yardHeight,
    // num,
}: WeatherStationModelProps) => {
    const { map: settings } = useSettings();
    // const { focusStation } = useFocus();
    // const { Bridge } = useBridge();
    // const setStationPosition = useComplexStore((state) => state.setStationPosition);

    const meshRef = useRef<Mesh>(null);
    // const [showInfo, setShowInfo] = useState(false);

    // const data = useStation(mastId, yardHeight, num);
    // const devices = useDeviceData(data?.id);

    // useEffect(() => {
    //     if (meshRef.current) {
    //         const worldPosition = new Vector3();
    //         meshRef.current.getWorldPosition(worldPosition);

    //         setStationPosition(data?.id.toString(), worldPosition);
    //     }
    // }, [data, setStationPosition]);

    // const handleStationClick = (e: ThreeEvent<MouseEvent>) => {
    // e.stopPropagation();
    // if (!showInfo && data) focusStation(data.id);
    // setShowInfo((prev) => !prev);
    // };

    // if (!data || !devices) {
    //     console.error(`Impossible to get weather station: ${mastId}, ${yardHeight}, ${num}`);
    //     return null;
    // }

    return (
        <>
            {/* {showInfo && (
                <Html
                    distanceFactor={14}
                    position={[position.x + 2.2 * (num === 1 ? -1 : 1), position.y, position.z]}
                    center
                    occlude
                    zIndexRange={[0, 10]}>
                    <Bridge>
                        <div className={clsx(s['info-box'])}>
                            {data && (
                                <>
                                    <div className={clsx(s['header'])}>
                                        <div className={clsx(s['item'])}>
                                            Станция
                                            <GuidLabel value={data.id} objct='station' />
                                        </div>
                                        <IconButton
                                            iconName='cross'
                                            title='Закрыть'
                                            iconSize={16}
                                            onClick={() => setShowInfo(false)}
                                        />
                                    </div>
                                    <div className={clsx(s['item'])}>
                                        Мачта
                                        <GuidLabel value={mastId} objct='mast' />
                                    </div>
                                    {devices.length > 0 && (
                                        <>
                                            <span>Датчики:</span>
                                            <ol>
                                                {devices.map((device, index) => (
                                                    <>
                                                        <li key={index}>{device.name}</li>
                                                        <ul>
                                                            {Object.entries(device.data).map(
                                                                ([name, measure], mIndex) => (
                                                                    <li key={mIndex}>
                                                                        {name}:{' '}
                                                                        {measure.measurements
                                                                            .at(-1)
                                                                            ?.value.toFixed(2)}
                                                                        {measure.units}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </>
                                                ))}
                                            </ol>
                                        </>
                                    )}
                                </>
                            )}
                            {!data && <span>Не удалось определить станцию</span>}
                        </div>
                    </Bridge>
                </Html>
            )} */}
            <SphereMesh
                // name={data?.id.toString()}
                radius={settings.model.weatherStation.radius}
                position={position}
                color={settings.model.weatherStation.color}
                // onClick={handleStationClick}
                // onPointerOver={() => (document.body.style.cursor = 'pointer')}
                // onPointerOut={() => (document.body.style.cursor = 'auto')}
                ref={meshRef}
            />
        </>
    );
};
