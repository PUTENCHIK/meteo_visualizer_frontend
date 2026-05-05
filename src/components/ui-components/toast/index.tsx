import clsx from 'clsx';
import s from './toast.module.scss';
import type { ToastContentProps } from 'react-toastify';
import { ComponentRowBox } from '@components/component-row-box';
import { IconButton } from '@components/icon-button';
import type { ApiErrorResponse } from '@utils/http';

export interface ToastMessagePayload {
    text: string;
}

export interface ToastErrorPayload {
    error: Error | ApiErrorResponse;
    statusCode?: number;
}

export type ToastProps =
    | { type: 'message'; payload: ToastMessagePayload }
    | { type: 'error'; payload: ToastErrorPayload };

const typeToTitle: Record<ToastType, string> = {
    message: 'Сообщение',
    error: 'Ошибка',
};

export type ToastType = ToastProps['type'];

export const Toast = ({ closeToast, data: { type, payload } }: ToastContentProps<ToastProps>) => {
    return (
        <div className={clsx(s['toast'], s[type])}>
            <ComponentRowBox
                left={[
                    <h3>
                        {typeToTitle[type]} {type === 'error' && payload.statusCode}
                    </h3>,
                ]}
                right={[
                    <IconButton
                        iconName='cross'
                        title='Закрыть'
                        iconSize={16}
                        onClick={() => closeToast()}
                    />,
                ]}
                size='tiny'
            />
            {type === 'message' && <span>{payload.text}</span>}
            {type === 'error' && (
                <>
                    {'detail' in payload.error ? (
                        <span>{payload.error.detail.message}</span>
                    ) : (
                        <span>{payload.error.message}</span>
                    )}
                </>
            )}
        </div>
    );
};
