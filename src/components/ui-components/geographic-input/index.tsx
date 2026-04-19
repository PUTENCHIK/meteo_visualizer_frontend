import { VectorInput, type VectorInputRef } from '@components/vector-input';
import { geographicToNumber, numberToGeographic } from '@utils/coordinate-systems';
import { useRef } from 'react';
import { Vector3 } from 'three';

type GeographicParameter = 'latitude' | 'longitude';

interface GeographicInputProps {
    value: number;
    param: GeographicParameter;
    onChange?: (value: number) => void;
}

export const GeographicInput = ({ value, param, onChange }: GeographicInputProps) => {
    const inputRef = useRef<VectorInputRef>(null);
    const baseLimit = param === 'latitude' ? 90 : 180;

    const handleChange = (vector: Vector3) => {
        onChange?.(geographicToNumber(vector));
    };

    return (
        <VectorInput
            value={numberToGeographic(value)}
            postfixes={{ x: '°', y: "'", z: "''" }}
            min={{ x: -baseLimit, y: 0, z: 0 }}
            max={{ x: baseLimit, y: 59, z: 59 }}
            decimal={{ x: 0, y: 0, z: 1 }}
            onChange={handleChange}
            ref={inputRef}
        />
    );
};
