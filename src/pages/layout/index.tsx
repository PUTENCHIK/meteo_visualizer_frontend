import clsx from 'clsx';
import { Outlet, useLocation } from 'react-router-dom';
import s from './layout.module.scss';
import { DialogsBox } from '@dialogs/dialogs-box';

export const Layout = () => {
    const { pathname } = useLocation();

    const isAuthPage = pathname === '/auth';

    return (
        <>
            <main className={clsx(s['body'], isAuthPage && s['centered'])}>
                <Outlet />
                <DialogsBox />
            </main>
        </>
    );
};
