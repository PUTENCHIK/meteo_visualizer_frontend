import clsx from 'clsx';
import s from './input-label.module.scss';

type InputLabelOrientation = 'horizontal' | 'vertical';

interface InputLabelProps {
    label: string;
    orientation?: InputLabelOrientation;
    error?: string;
    required?: boolean;
    notLabel?: boolean;
    children: React.ReactNode;
}

export const InputLabel = ({
    label,
    orientation = 'vertical',
    error,
    required = false,
    notLabel = false,
    children,
}: InputLabelProps) => {
    const Component = notLabel ? 'div' : 'label';

    return (
        <Component className={clsx(s['label'], s[orientation])}>
            <div className={clsx(s['label-box'])}>
                <span>{label}:</span>
                {required && orientation === 'vertical' && (
                    <span className={clsx(s['required-mark'])}>*</span>
                )}
            </div>
            <div className={clsx(s['input-wrapper'])}>{children}</div>
            {error && <span className={clsx(s['error'])}>{error}</span>}
        </Component>
    );
};
