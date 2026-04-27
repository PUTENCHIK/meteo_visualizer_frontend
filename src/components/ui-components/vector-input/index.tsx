import clsx from 'clsx';
import s from './vector-input.module.scss';
import { NumberInput } from '@components/number-input';
import { Vector3, Vector4, Vector2 } from 'three';
import { type ComponentPropsWithoutRef } from 'react';

type VectorAxes<T> = Extract<keyof T, 'x' | 'y' | 'z' | 'w'>;

type VectorInputType = Vector2 | Vector3 | Vector4;

interface SharedInputProps {
    disabled?: boolean;
    readOnly?: boolean;
}

interface VectorInputProps<T extends VectorInputType>
    extends Omit<ComponentPropsWithoutRef<'div'>, 'value' | 'onChange'>, SharedInputProps {
    value: T;
    axisLabels?: Partial<Record<VectorAxes<T>, string>>;
    postfixes?: Partial<Record<VectorAxes<T>, string>>;
    min?: Partial<Record<VectorAxes<T>, number>>;
    max?: Partial<Record<VectorAxes<T>, number>>;
    maxLength?: Partial<Record<VectorAxes<T>, number>>;
    step?: Partial<Record<VectorAxes<T>, number>>;
    decimal?: Partial<Record<VectorAxes<T>, number>>;
    placeholder?: Partial<Record<VectorAxes<T>, string>>;
    onChange?: (value: T) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const VectorInput = <T extends VectorInputType>({
    value,
    axisLabels,
    postfixes,
    min,
    max,
    maxLength,
    step,
    decimal,
    disabled,
    readOnly,
    placeholder,
    onChange,
    onBlur,
    className,
    ...rest
}: VectorInputProps<T>) => {
    const axes: string[] =
        'w' in value ? ['x', 'y', 'z', 'w'] : 'z' in value ? ['x', 'y', 'z'] : ['x', 'y'];

    const handleChange = (axis: VectorAxes<T>, newValue: number) => {
        const nextValue = value.clone() as T;
        (nextValue[axis] as number) = newValue;
        onChange?.(nextValue);
    };

    return (
        <div className={clsx(s['vector-input'], className)} {...rest}>
            {axes.map((axis) => (
                <div key={axis as string} className={s['axis-wrapper']}>
                    <NumberInput
                        value={value[axis as VectorAxes<T>] as number}
                        className={s['axis-input']}
                        postfix={postfixes?.[axis as VectorAxes<T>]}
                        min={min?.[axis as VectorAxes<T>]}
                        max={max?.[axis as VectorAxes<T>]}
                        maxLength={maxLength?.[axis as VectorAxes<T>]}
                        decimal={decimal?.[axis as VectorAxes<T>]}
                        step={step?.[axis as VectorAxes<T>]}
                        placeholder={placeholder?.[axis as VectorAxes<T>]}
                        disabled={disabled}
                        readOnly={readOnly}
                        onChange={(v) => handleChange(axis as VectorAxes<T>, v)}
                        onBlur={onBlur}
                    />
                    {axisLabels?.[axis as VectorAxes<T>] && (
                        <span className={s['axis-label']}>{axisLabels[axis as VectorAxes<T>]}</span>
                    )}
                </div>
            ))}
        </div>
    );
};
