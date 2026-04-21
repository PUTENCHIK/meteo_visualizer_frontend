import clsx from 'clsx';
import s from './base-dialog.module.scss';
import { useDialogs, type DialogId } from '@context/dialog-context';
import { IconButton } from '@components/icon-button';
import { useEffect, useRef } from 'react';
import { ComponentRowBox } from '@components/component-row-box';
import React from 'react';

interface BaseDialogProps {
    dialogId: DialogId;
    title: string | React.ReactNode;
    hardClose?: boolean;
    children?: React.ReactNode;
}

export const BaseDialog = ({ dialogId, title, hardClose = false, children }: BaseDialogProps) => {
    const { activeDialogs: activeDialog, closeDialog } = useDialogs();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const dialog = activeDialog.find((d) => d.id === dialogId);
    const isOpen = !!dialog;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleClickOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (!hardClose && dialogRef.current && dialogRef.current === (event.target as Node)) {
            closeDialog();
        }
    };

    const handleCancel = (e: React.SyntheticEvent) => {
        e.preventDefault();
        closeDialog();
    };

    return (
        <dialog
            className={clsx(s['base-dialog'])}
            onClick={handleClickOutside}
            onCancel={handleCancel}
            ref={dialogRef}>
            <div className={clsx(s['dialog'])}>
                <div className={clsx(s['header-wrapper'])}>
                    <ComponentRowBox
                        left={[
                            typeof title === 'string' ? (
                                <h2>{title}</h2>
                            ) : (
                                <React.Fragment>{title}</React.Fragment>
                            ),
                        ]}
                        right={[
                            <IconButton
                                iconName='cross'
                                title='Закрыть'
                                iconSize={24}
                                onClick={() => closeDialog()}
                            />,
                        ]}
                    />
                </div>
                <div className={clsx(s['content-wrapper'])}>
                    <div className={clsx(s['content'])}>{children}</div>
                </div>
            </div>
        </dialog>
    );
};
