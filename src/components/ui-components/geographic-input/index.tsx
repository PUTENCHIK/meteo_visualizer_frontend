import clsx from 'clsx';
import s from './geographic-input.module.scss';
import { Select } from '@components/select';
import { VectorInput } from '@components/vector-input';
import { geographicToNumber, numberToGeographic } from '@utils/coordinate-systems';
import { useEffect, useState } from 'react';
import { Vector3 } from 'three';

type GeographicParameter = 'lat' | 'lon';

type SignType = '-' | '+';

interface GeographicInputProps {
    value: number;
    param: GeographicParameter;
    readOnly?: boolean;
    disabled?: boolean;
    onChange?: (value: number) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const GeographicInput = ({
    value,
    param,
    readOnly = false,
    disabled = false,
    onChange,
    onBlur,
}: GeographicInputProps) => {
    const baseLimit = param === 'lat' ? 90 : 180;
    const maxLength = param === 'lat' ? 2 : 3;

    const [sign, setSign] = useState<SignType>(value >= 0 ? '+' : '-');
    const [vector, setVector] = useState<Vector3>(numberToGeographic(value));

    useEffect(() => {
        setSign(value >= 0 ? '+' : '-');
        setVector(numberToGeographic(value));
    }, [value]);

    useEffect(() => {
        onChange?.(geographicToNumber(vector, sign === '+' ? 1 : -1));
    }, [sign, vector]);

    const handleSelectChange = (value: SignType) => {
        setSign(value);
    };

    const handleVectorChange = (vector: Vector3) => {
        setVector(vector);
    };

    return (
        <div className={clsx(s['geographic-input-wrapper'])}>
            {!readOnly ? (
                <Select value={sign} options={['-', '+']} onChange={handleSelectChange} />
            ) : (
                <span className={clsx(s['sign'])}>{sign}</span>
            )}
            <VectorInput
                value={vector}
                postfixes={{ x: '°', y: "'", z: "''" }}
                min={{ x: 0, y: 0, z: 0 }}
                max={{ x: baseLimit, y: 59, z: 59 }}
                maxLength={{ x: maxLength, y: 2, z: 3 }}
                decimal={{ x: 0, y: 0, z: 1 }}
                placeholder={{ x: '0', y: '0', z: '0' }}
                readOnly={readOnly}
                disabled={disabled}
                onChange={handleVectorChange}
                onBlur={onBlur}
            />
        </div>
    );
};
