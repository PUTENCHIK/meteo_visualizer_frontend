import clsx from 'clsx';
import s from './base-dialog.module.scss';
import { useDialogs, type DialogId } from '@context/dialog-context';
import { IconButton } from '@components/icon-button';
import { useEffect, useRef } from 'react';
import { ComponentHeader } from '@components/component-header';

interface BaseDialogProps {
    dialogId: DialogId;
    title: string;
    children?: React.ReactNode;
}

export const BaseDialog = ({ dialogId, title, children }: BaseDialogProps) => {
    const { activeDialog, closeDialog } = useDialogs();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const isOpen = activeDialog === dialogId;

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

    const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const target = e.target as HTMLElement;
        const isInsideDialog = target.closest(`.${s['dialog']}`);

        if (!isInsideDialog) {
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
            onClick={handleClick}
            onCancel={handleCancel}
            ref={dialogRef}>
            <div className={clsx(s['dialog'])}>
                <ComponentHeader
                    left={[<h2>{title}</h2>]}
                    right={[
                        <IconButton
                            iconName='cross'
                            title='Закрыть'
                            iconSize={24}
                            onClick={closeDialog}
                        />,
                    ]}
                />
                <div className={clsx(s['content'])}>{children}</div>
            </div>
        </dialog>
    );
};
