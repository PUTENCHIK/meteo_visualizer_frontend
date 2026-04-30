import clsx from 'clsx';
import s from './complex-page.module.scss';
import { CompassModel } from '@models_/compass-model';
import { ComplexScene } from '@models_/complex-scene';
import { SettingsMenu } from '@components/settings-menu';
import { IconButton } from '@components/icon-button';
import { useNavigate, useParams } from 'react-router-dom';
import { usePanels } from '@context/panel-context';
import { Button } from '@components/button';
import { SceneStats } from '@components/scene-stats';
import { useDialogs } from '@context/dialog-context';
import { useEffect, useMemo } from 'react';
import { ComponentRowBox } from '@components/component-row-box';
import { useComplex } from '@hooks/complexes/use-complex';
import { Guid } from 'typescript-guid';
import { Loader } from '@components/loader';
import { useComplexStore } from '@stores/complex-store';
import { useSocket } from '@context/websocket-context';

export const ComplexPage = () => {
    const navigate = useNavigate();
    const { openPanel } = usePanels();
    const { openDialog } = useDialogs();
    const { isConnected, disableConnection } = useSocket();
    const { complex, setComplex, reset } = useComplexStore();
    const { id: complexId } = useParams<{ id: string }>();

    const isIdValid = Guid.isGuid(complexId ?? '');

    const parsedId = useMemo(() => {
        return isIdValid && complexId ? Guid.parse(complexId) : undefined;
    }, [complexId, isIdValid]);

    const { data: loadedComplex, isLoading, isError } = useComplex(parsedId);

    useEffect(() => {
        return () => disableConnection();
    }, []);

    useEffect(() => {
        if (loadedComplex) {
            setComplex(loadedComplex);
        }
        return () => reset();
    }, [loadedComplex, setComplex]);

    const handleBackClick = () => {
        navigate('/complexes');
    };

    return (
        <>
            <div className={clsx(s['header-menu-wrapper'])}>
                <ComponentRowBox
                    left={[
                        [
                            <IconButton
                                iconName='arrow'
                                title='На страницу комплексов'
                                onClick={handleBackClick}
                            />,
                            complex && (
                                <h2 className={clsx(s['page-title'])} title={complex.name}>
                                    {complex.name}
                                </h2>
                            ),
                        ],
                        complex && [
                            <Button
                                title={'Данные комплекса'}
                                type='tertiary'
                                onClick={() => openPanel('complex')}
                            />,
                            <Button
                                title={'Соединение'}
                                type={isConnected ? 'primary' : 'tertiary'}
                                onClick={() => openPanel('websocketApi')}
                            />,
                            <Button
                                title={'График'}
                                type='tertiary'
                                onClick={() => openPanel('charts')}
                            />,
                        ],
                    ]}
                    right={[
                        [
                            <IconButton
                                iconName='user'
                                title='Профиль'
                                iconSize={28}
                                onClick={() => openDialog('profile')}
                            />,
                            <IconButton
                                iconName='settings'
                                title='Настройки'
                                iconSize={28}
                                onClick={() => openDialog('settings')}
                            />,
                        ],
                    ]}
                    size='big'
                />
            </div>
            <div className={clsx(s['loading-container'])}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {!isIdValid ? (
                            <span>Не удалось распарсить ID: '{complexId}'</span>
                        ) : (
                            isError && <span>Не удалось получить комплекс: '{complexId}'</span>
                        )}
                    </>
                )}
            </div>

            {complex && (
                <>
                    <ComplexScene />
                    <SettingsMenu />

                    <CompassModel />
                    <SceneStats />
                </>
            )}
        </>
    );
};
