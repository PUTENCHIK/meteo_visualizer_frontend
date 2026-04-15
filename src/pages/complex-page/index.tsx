import clsx from 'clsx';
import s from './complex-page.module.scss';
import { CompassModel } from '@models_/compass-model';
import { Scene } from '@models_/scene';
import { SettingsMenu } from '@components/settings-menu';
import { IconButton } from '@components/icon-button';
import { useNavigate } from 'react-router-dom';
import { usePanels } from '@context/panel-context';
import { ComplexDataPanel } from '@panels/complex-data-panel';
import { WebsocketApiPanel } from '@panels/websocket-api-panel';
import { Button } from '@components/button';
import { MastsPanel } from '@panels/masts-panel';
import { WeatherStationsPanel } from '@panels/weather-stations-panel';
import { ChartsPanel } from '@panels/charts-panel';
import { SceneStats } from '@components/scene-stats';
import { ProfileDialog } from '@dialogs/profile-dialog';
import { useDialogs } from '@context/dialog-context';

export const ComplexPage = () => {
    const navigate = useNavigate();
    const { togglePanel } = usePanels();
    const { openDialog } = useDialogs();

    const handleBackToHomePageClick = () => {
        navigate('/');
    };

    return (
        <>
            <div className={clsx(s['header-menu-wrapper'])}>
                <div className={clsx(s['header-side'])}>
                    <div className={clsx(s['header-group'])}>
                        <IconButton
                            iconName='arrow'
                            title='Назад на главную'
                            onClick={handleBackToHomePageClick}
                        />
                        <h2>Комплекс МАМКА №1243</h2>
                    </div>
                    <div className={clsx(s['header-group'])}>
                        <Button
                            title={'Данные комплекса'}
                            type='tertiary'
                            onClick={() => togglePanel('complexData')}
                        />
                        <Button
                            title={'Веб-сокет'}
                            type='tertiary'
                            onClick={() => togglePanel('websocketApi')}
                        />
                        <Button
                            title={'Мачты'}
                            type='tertiary'
                            onClick={() => togglePanel('masts')}
                        />
                        <Button
                            title={'Метеостанции'}
                            type='tertiary'
                            onClick={() => togglePanel('weatherStations')}
                        />
                        <Button
                            title={'График'}
                            type='tertiary'
                            onClick={() => togglePanel('charts')}
                        />
                    </div>
                </div>
                <div className={clsx(s['header-side'])}>
                    <div className={clsx(s['header-group'])}>
                        <IconButton
                            iconName='user'
                            title='Профиль'
                            iconSize={28}
                            onClick={() => openDialog('profile')}
                        />
                        <IconButton
                            iconName='settings'
                            title='Настройки приложения'
                            iconSize={28}
                        />
                    </div>
                </div>
            </div>

            <Scene />
            <SettingsMenu />

            <CompassModel />
            <SceneStats />

            <ComplexDataPanel />
            <WebsocketApiPanel />
            <MastsPanel />
            <WeatherStationsPanel />
            <ChartsPanel />

            <ProfileDialog />
        </>
    );
};
