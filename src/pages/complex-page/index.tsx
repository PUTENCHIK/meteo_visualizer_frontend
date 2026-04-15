import clsx from 'clsx';
import s from './complex-page.module.scss';
import { CompassModel } from '@models_/compass-model';
import { Scene } from '@models_/scene';
import { SettingsMenu } from '@components/settings-menu';
import { IconButton } from '@components/icon-button';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '@context/dialog-context';
import { ComplexDataDialog } from '@panels/complex-data-panel';
import { WebsocketApiDialog } from '@panels/websocket-api-panel';
import { Button } from '@components/button';
import { MastsDialog } from '@panels/masts-panel';
import { WeatherStationsDialog } from '@panels/weather-stations-panel';
import { ChartsPanel } from '@panels/charts-panel';
import { SceneStats } from '@components/scene-stats';

export const ComplexPage = () => {
    const navigate = useNavigate();
    const { toggleDialog } = useDialogs();

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
                            onClick={() => toggleDialog('complexData')}
                        />
                        <Button
                            title={'Веб-сокет'}
                            type='tertiary'
                            onClick={() => toggleDialog('websocketApi')}
                        />
                        <Button
                            title={'Мачты'}
                            type='tertiary'
                            onClick={() => toggleDialog('masts')}
                        />
                        <Button
                            title={'Метеостанции'}
                            type='tertiary'
                            onClick={() => toggleDialog('weatherStations')}
                        />
                        <Button
                            title={'График'}
                            type='tertiary'
                            onClick={() => toggleDialog('charts')}
                        />
                    </div>
                </div>
                <div className={clsx(s['header-side'])}>
                    <div className={clsx(s['header-group'])}>
                        <IconButton iconName='user' title='Профиль' iconSize={28} />
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

            <ComplexDataDialog />
            <WebsocketApiDialog />
            <MastsDialog />
            <WeatherStationsDialog />
            <ChartsPanel />
        </>
    );
};
