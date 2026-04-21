import clsx from 'clsx';
import s from './toast.module.scss';
import {
    Toast,
    type ToastErrorPayload,
    type ToastMessagePayload,
    type ToastProps,
} from '@components/toast';
import { toast } from 'react-toastify';

const showNotification = (toastProps: ToastProps) => {
    toast((props) => <Toast {...props} data={toastProps} />, {
        closeButton: false,
        icon: false,
        className: clsx(s['toast-wrapper']),
        hideProgressBar: true,
        position: 'bottom-right',
        autoClose: 5000,
    });
};

export const showMessage = (payload: ToastMessagePayload) => {
    showNotification({
        type: 'message',
        payload: payload,
    });
};

export const showError = (payload: ToastErrorPayload) => {
    showNotification({
        type: 'error',
        payload: payload,
    });
};
