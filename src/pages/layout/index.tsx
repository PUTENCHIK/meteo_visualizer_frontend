import clsx from 'clsx';
import { Outlet, useLocation } from 'react-router-dom';
import s from './layout.module.scss';
import { DialogsBox } from '@dialogs/dialogs-box';
import { ToastContainer } from 'react-toastify';
import { PanelsBox } from '@panels/panels-box';
import { useDialogs } from '@context/dialog-context';
import { useEffect } from 'react';
import { usePanels } from '@context/panel-context';

export const Layout = () => {
    const { pathname } = useLocation();
    const isAuthPage = pathname === '/auth';

    const { closeAllDialogs } = useDialogs();
    const { closeAllPanels } = usePanels();

    useEffect(() => {
        closeAllDialogs();
        closeAllPanels();
    }, [closeAllDialogs, closeAllPanels]);

    return (
        <>
            <main className={clsx(s['body'], isAuthPage && s['centered'])}>
                <Outlet />
                <PanelsBox />
                <DialogsBox />
                <ToastContainer />
            </main>
        </>
    );
};
