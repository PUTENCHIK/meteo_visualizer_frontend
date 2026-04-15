import clsx from "clsx";
import s from './base-form.module.scss';
import React from "react";

type FormAction = "POST" | "GET";

interface BaseFormProps {
    action?: FormAction;
    buttons?: React.ReactNode[];
    onSubmit?: () => Promise<void> | void;
    children: React.ReactNode;
}

export const BaseForm = ({action = "POST", buttons, onSubmit, children}: BaseFormProps) => {

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault();
        await onSubmit?.();
    }

    return (
        <form action={action} className={clsx(s['base-form'])} onSubmit={handleSubmit}>
            <div className={clsx(s['inputs-box'])}>
                {children}
            </div>
            {buttons && buttons.length > 0 && (
                <div className={clsx(s['buttons-box'])}>
                    {buttons.map((btn, index) => (
                        <React.Fragment key={index}>{btn}</React.Fragment>
                    ))}
                </div>
            )}
        </form>
    );
}