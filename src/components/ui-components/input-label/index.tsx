import clsx from 'clsx';
import s from './input-label.module.scss';

type InputLabelOrientation = 'horizontal' | 'vertical';

interface InputLabelProps {
    label: string;
    orientation?: InputLabelOrientation;
    reverse?: boolean;
    nowrap?: boolean;
    error?: string;
    required?: boolean;
    notLabel?: boolean;
    children: React.ReactNode;
}

export const InputLabel = ({
    label,
    orientation = 'vertical',
    reverse = false,
    error,
    required = false,
    notLabel = false,
    children,
}: InputLabelProps) => {
    const Component = notLabel ? 'div' : 'label';

    return (
        <Component className={clsx(s['label'])}>
            <div className={clsx(s['content'], s[orientation], reverse && s['reverse'])}>
                <div className={clsx(s['label-box'])}>
                    <span>
                        {label}
                        {!reverse && ':'}
                    </span>
                    {required && orientation === 'vertical' && (
                        <span className={clsx(s['required-mark'])}>*</span>
                    )}
                </div>
                <div className={clsx(s['input-wrapper'])}>{children}</div>
            </div>
            {error && <span className={clsx(s['error'])}>{error}</span>}
        </Component>
    );
};
