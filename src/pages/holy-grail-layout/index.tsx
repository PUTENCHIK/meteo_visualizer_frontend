import clsx from 'clsx';
import s from './holy-grail-layout.module.scss';
import { Header } from '@pages/header';

interface HolyGrailLayoutProps {
    children?: React.ReactNode;
}

export const HolyGrailLayout = ({ children }: HolyGrailLayoutProps) => {
    return (
        <div className={clsx(s['main'])}>
            <Header />
            <div className={clsx(s['content'])}>{children}</div>
        </div>
    );
};
