import clsx from 'clsx';
import s from './dialog-window.module.scss';
import { Rnd } from 'react-rnd';
import { IconButton } from '@components/icon-button';
import { useDialogs, type DialogId } from '@context/dialog-context';
import React from 'react';
import { useSettings } from '@context/use-settings';

interface WindowSizeLimits {
    min?: number | null;
    max?: number | null;
}

interface DialogWindowProps {
    dialogId: DialogId;
    title: string;
    buttons?: React.ReactNode[];
    widthLimits?: WindowSizeLimits;
    heightLimits?: WindowSizeLimits;
    children?: React.ReactNode;
}

export const DialogWindow = ({
    dialogId,
    title,
    buttons,
    widthLimits,
    heightLimits,
    children,
}: DialogWindowProps) => {
    const { map: settings } = useSettings();
    const { activeDialogs, closeDialog, focusDialog } = useDialogs();

    const isOpen = activeDialogs.includes(dialogId);

    const handleCloseClick = () => {
        closeDialog(dialogId);
    };

    if (!isOpen) return null;

    return (
        <Rnd
            className={clsx(s['dialog-window'])}
            default={{
                x: 100 + 20 * activeDialogs.indexOf(dialogId),
                y: 100 + 20 * activeDialogs.indexOf(dialogId),
                width: 'auto',
                height: 'auto',
            }}
            minWidth={
                widthLimits?.min === null
                    ? undefined
                    : (widthLimits?.min ?? settings.ui.windows.minWidth)
            }
            maxWidth={
                widthLimits?.max === null
                    ? undefined
                    : (widthLimits?.max ?? settings.ui.windows.maxWidth)
            }
            minHeight={
                heightLimits?.min === null
                    ? undefined
                    : (heightLimits?.min ?? settings.ui.windows.minHeight)
            }
            maxHeight={
                heightLimits?.max === null
                    ? undefined
                    : (heightLimits?.max ?? settings.ui.windows.maxHeight)
            }
            bounds='window'
            dragHandleClassName='handle-area'
            cancel='.close-button'
            onMouseDown={() => focusDialog(dialogId)}
            style={{
                zIndex: 10 + activeDialogs.indexOf(dialogId),
                maxHeight: `${heightLimits?.max ?? settings.ui.windows.maxHeight}px`,
            }}>
            <div className={clsx(s['window-content'])}>
                <div className='handle-area'>
                    <div className={clsx(s['window-title'])}>
                        <h2 className={clsx(s['title'])}>{title}</h2>
                        <IconButton
                            iconName='cross'
                            title='Закрыть'
                            className='close-button'
                            onClick={handleCloseClick}
                        />
                    </div>
                </div>
                <div className={clsx(s['content'])}>
                    <div className={clsx(s['children-wrapper'])}>{children}</div>
                    {buttons && buttons.length > 0 && (
                        <div className={clsx(s['buttons-box'])}>
                            {buttons.map((btn, index) => (
                                <React.Fragment key={index}>{btn}</React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Rnd>
    );
};
