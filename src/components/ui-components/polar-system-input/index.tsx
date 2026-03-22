import { VectorInput } from '@components/vector-input';
import { PolarPosition } from '@utils/coordinate-systems';
import { useState } from 'react';
import { Vector2 } from 'three';

interface PolarSystemInputProps {
    value: PolarPosition;
    disabled?: boolean;
    onChange?: (value: PolarPosition) => void;
}

export const PolarSystemInput = ({ value, disabled = false, onChange }: PolarSystemInputProps) => {
    const [innerValue, setInnerValue] = useState<Vector2>(value.toVector2());

    const handleChange = (v: Vector2) => {
        setInnerValue(v);
        onChange?.(new PolarPosition(v.x, v.y));
    };

    return (
        <VectorInput
            value={innerValue}
            axisLabels={{ x: 'радиус', y: 'полярный угол' }}
            postfixes={{ x: 'м', y: '°' }}
            min={{ x: 0, y: 0 }}
            max={{ y: 360 }}
            decimal={{ x: 2, y: 0 }}
            disabled={disabled}
            onChange={handleChange}
        />
    );
};
