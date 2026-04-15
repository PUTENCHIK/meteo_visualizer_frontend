import clsx from 'clsx';
import s from './input-label.module.scss';

type InputLabelOrientation = 'horizontal' | 'vertical';

interface InputLabelProps {
    label: string;
    orientation?: InputLabelOrientation;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}

export const InputLabel = ({
    label,
    orientation = 'vertical',
    error,
    required = false,
    children,
}: InputLabelProps) => {
    return (
        <div className={clsx(s['label'], s[orientation])}>
            <div className={clsx(s['label-box'])}>
                <span>{label}:</span>
                {required && <span className={clsx(s['required-mark'])}>*</span>}
            </div>
            <div className={clsx(s['input-wrapper'])}>
                {children}
                {error && <span className={clsx(s['error'])}>{error}</span>}
            </div>
        </div>
    );
};
