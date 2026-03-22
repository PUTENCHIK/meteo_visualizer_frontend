import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { VectorInput, type VectorInputRef } from '@components/vector-input';
import { useComplexData } from '@context/complex-data-context';
import { DialogWindow } from '@dialogs/dialog-window';
import { geographicToNumber } from '@utils/coordinate-systems';
import { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

export const ComplexDataDialog = () => {
    const { position, updatePosition } = useComplexData();

    const latRef = useRef<VectorInputRef>(null);
    const lonRef = useRef<VectorInputRef>(null);
    const [latitude, setLatitude] = useState<Vector3>(new Vector3().copy(position.lat));
    const [longitude, setLongitude] = useState<Vector3>(new Vector3().copy(position.lon));

    useEffect(() => {
        latRef.current?.update();
        lonRef.current?.update();
    }, [latitude, longitude]);

    const handleLatitudeChange = (lat: Vector3) => {
        const degrees = geographicToNumber(lat);
        if (degrees > 90) {
            setLatitude(new Vector3(90, 0, 0));
        } else if (degrees < -90) {
            setLatitude(new Vector3(-90, 0, 0));
        } else {
            setLatitude(lat);
        }
    };

    const handleLongitudeChange = (lon: Vector3) => {
        const degrees = geographicToNumber(lon);
        if (degrees > 180) {
            setLongitude(new Vector3(180, 0, 0));
        } else if (degrees < -180) {
            setLongitude(new Vector3(-180, 0, 0));
        } else {
            setLongitude(lon);
        }
    };

    const handleReset = () => {
        setLatitude(position.lat);
        setLongitude(position.lon);
    };

    const handleSave = () => {
        updatePosition(latitude, longitude);
    };

    return (
        <DialogWindow
            dialogId='complexData'
            title='Данные комплекса'
            widthLimits={{ min: 300 }}
            buttons={[
                <Button title='Сбросить' onClick={handleReset} />,
                <Button title='Сохранить' type='primary' onClick={handleSave} />,
            ]}>
            <InputLabel label='Широта'>
                <VectorInput
                    value={latitude}
                    postfixes={{ x: '°', y: "'", z: "''" }}
                    min={{ x: -90, y: 0, z: 0 }}
                    max={{ x: 90, y: 59, z: 59 }}
                    decimal={{ x: 0, y: 0, z: 5 }}
                    onChange={handleLatitudeChange}
                    ref={latRef}
                />
            </InputLabel>
            <InputLabel label='Долгота'>
                <VectorInput
                    value={longitude}
                    postfixes={{ x: '°', y: "'", z: "''" }}
                    min={{ x: -180, y: 0, z: 0 }}
                    max={{ x: 180, y: 59, z: 59 }}
                    decimal={{ x: 0, y: 0, z: 5 }}
                    onChange={handleLongitudeChange}
                    ref={lonRef}
                />
            </InputLabel>
        </DialogWindow>
    );
};
