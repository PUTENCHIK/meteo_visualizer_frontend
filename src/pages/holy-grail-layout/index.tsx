import clsx from 'clsx';
import s from './holy-grail-layout.module.scss';
import { Header } from '@pages/header';
import { useEffect } from 'react';
import { useDialogs } from '@context/dialog-context';

interface HolyGrailLayoutProps {
    children?: React.ReactNode;
}

export const HolyGrailLayout = ({ children }: HolyGrailLayoutProps) => {
    const { closeDialog } = useDialogs();

    useEffect(() => {
        closeDialog();
    }, [closeDialog]);

    return (
        <div className={clsx(s['main'])}>
            <Header />
            <div className={clsx(s['content'])}>{children}</div>
        </div>
    );
};
