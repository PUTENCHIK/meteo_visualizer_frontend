import clsx from 'clsx';
import s from './base-form.module.scss';
import type { AxiosError } from 'axios';
import React, { useState } from 'react';
import type { ApiErrorResponse, ErrorCode } from '@utils/http';

type FormAction = 'POST' | 'GET';

interface BaseFormProps {
    action?: FormAction;
    buttons?: React.ReactNode[];
    onSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => Promise<void> | void;
    children: React.ReactNode;
}

export const BaseForm = ({ action = 'POST', buttons, onSubmit, children }: BaseFormProps) => {
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await onSubmit?.(event);
        } catch (e) {
            const error = e as AxiosError<ApiErrorResponse>;
            const detail = error.response?.data.detail;

            if (detail) {
                if ((['INVALID_CREDENTIALS', 'VALIDATION'] as ErrorCode[]).includes(detail.code)) {
                    setFormError(detail.message);
                }
            }
            throw e;
        }
    };

    return (
        <form action={action} className={clsx(s['base-form'])} onSubmit={handleSubmit}>
            {formError && <div className={clsx(s['error-block'])}>{formError}</div>}
            <div className={clsx(s['inputs-box'])}>{children}</div>
            {buttons && buttons.length > 0 && (
                <div className={clsx(s['buttons-box'])}>
                    {buttons.map((btn, index) => (
                        <React.Fragment key={index}>{btn}</React.Fragment>
                    ))}
                </div>
            )}
        </form>
    );
};
