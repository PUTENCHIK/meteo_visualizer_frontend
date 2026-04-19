import clsx from 'clsx';
import s from './base-panel.module.scss';
import { Rnd } from 'react-rnd';
import { IconButton } from '@components/icon-button';
import { usePanels, type PanelId } from '@context/panel-context';
import React from 'react';
import { useSettings } from '@context/use-settings';
import { ComponentRowBox } from '@components/component-row-box';

interface WindowSizeLimits {
    min?: number | null;
    max?: number | null;
}

interface NoContent {
    cond: () => boolean;
    label: string;
}

interface BasePanelProps {
    panelId: PanelId;
    title: string;
    buttons?: React.ReactNode[];
    widthLimits?: WindowSizeLimits;
    heightLimits?: WindowSizeLimits;
    noContent?: NoContent;
    children?: React.ReactNode;
}

export const BasePanel = ({
    panelId,
    title,
    buttons,
    widthLimits,
    heightLimits,
    noContent,
    children,
}: BasePanelProps) => {
    const { map: settings } = useSettings();
    const { activePanels, closePanel, focusPanel } = usePanels();

    const isOpen = activePanels.includes(panelId);

    const handleCloseClick = () => {
        closePanel(panelId);
    };

    if (!isOpen) return null;

    return (
        <Rnd
            className={clsx(s['panel-window'])}
            default={{
                x: 100 + 20 * activePanels.indexOf(panelId),
                y: 100 + 20 * activePanels.indexOf(panelId),
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
            onMouseDown={() => focusPanel(panelId)}
            style={{
                zIndex: 10 + activePanels.indexOf(panelId),
                maxHeight: `${heightLimits?.max ?? settings.ui.windows.maxHeight}px`,
            }}>
            <div className={clsx(s['window-content'])}>
                <div className='handle-area'>
                    <div className={clsx(s['window-title'])}>
                        <ComponentRowBox
                            left={[<h2 className={clsx(s['title'])}>{title}</h2>]}
                            right={[
                                <IconButton
                                    iconName='cross'
                                    title='Закрыть'
                                    className='close-button'
                                    onClick={handleCloseClick}
                                />,
                            ]}
                        />
                    </div>
                </div>
                <div className={clsx(s['content'])}>
                    <div className={clsx(s['children-wrapper'])}>
                        {React.Children.count(children) === 0 || noContent?.cond() ? (
                            <div className={clsx(s['no-content-box'])}>
                                <span>{noContent?.label ?? 'Нет контента'}</span>
                            </div>
                        ) : (
                            children
                        )}
                    </div>
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
