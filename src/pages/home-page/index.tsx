import clsx from 'clsx';
import s from './home-page.module.scss';
import { Header } from '@pages/header';
import { useTheme } from '@context/theme-context';
import { Link } from 'react-router-dom';
import { Toggle } from '@components/toggle';
import { InputLabel } from '@components/input-label';

export const HomePage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={clsx(s['main'])}>
            <Header />
            <div className={clsx(s['content'])}>
                <h1>Главная страница</h1>

                <Link to={'/complex'}>На страницу комплекса</Link>

                <InputLabel label='Тёмная тема' orientation='horizontal'>
                    <Toggle value={theme === 'dark'} onChange={toggleTheme} />
                </InputLabel>
            </div>
        </div>
    );
};
