import clsx from 'clsx';
import s from './text-input.module.scss';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { IconButton } from '@components/icon-button';

interface TextInputProps extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur'
> {
    value?: string;
    defaultValue?: string;
    password?: boolean;
    trim?: boolean;
    onChange?: (value: string) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
    value: controlledValue,
    defaultValue,
    password = false,
    trim = true,
    onChange,
    onBlur,
    className,
    ...rest
}: TextInputProps) => {
    const [localValue, setLocalValue] = useState(defaultValue ?? '');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const displayValue = controlledValue !== undefined ? controlledValue : localValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;
        newValue = trim ? newValue.trim() : newValue;
        if (controlledValue === undefined) {
            setLocalValue(newValue);
        }
        onChange?.(newValue);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onChange?.(trim ? displayValue.trim() : displayValue);
        onBlur?.(event);
    };

    const togglePasswordVisible = () => {
        setPasswordVisible((prev) => !prev);
    };

    const inputType = password ? (passwordVisible ? 'text' : 'password') : 'text';

    return (
        <div className={clsx(s['input-container'], className)}>
            <input
                {...rest}
                type={inputType}
                className={clsx(s['text-input'], password && s['password'])}
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {password && (
                <IconButton
                    iconName={passwordVisible ? 'eye-off' : 'eye'}
                    className={clsx(s['icon-button'])}
                    title={passwordVisible ? 'Скрыть' : 'Показать'}
                    iconSize={12}
                    onClick={togglePasswordVisible}
                />
            )}
        </div>
    );
};
