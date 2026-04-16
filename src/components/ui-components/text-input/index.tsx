import clsx from 'clsx';
import s from './text-input.module.scss';
import { useState } from 'react';
import { IconButton } from '@components/icon-button';

interface TextInputProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    password?: boolean;
    trim?: boolean;
    autoComplete?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
}

export const TextInput = ({
    value: controlledValue,
    defaultValue,
    placeholder,
    maxLength,
    minLength,
    name,
    password = false,
    trim = true,
    autoComplete,
    disabled = false,
    onChange,
    onBlur,
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

    const handleBlur = () => {
        onBlur?.(trim ? displayValue.trim() : displayValue);
    };

    const togglePasswordVisible = () => {
        setPasswordVisible((prev) => !prev);
    };

    const inputType = password ? (passwordVisible ? 'text' : 'password') : 'text';

    return (
        <div className={clsx(s['input-container'])}>
            <input
                type={inputType}
                name={name}
                autoComplete={autoComplete}
                className={clsx(s['text-input'], password && s['password'])}
                minLength={minLength}
                maxLength={maxLength}
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
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
