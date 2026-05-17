import clsx from 'clsx';
import s from './scene-settings-menu.module.scss';
import { SvgIcon } from '@components/svg-icon';
import { useState } from 'react';
import { SettingsItem } from '@components/app-settings/settings-item';
import { useSceneSettings } from '@hooks/use-scene-settings';
import { IconButton } from '@components/icon-button';
import { ComponentRowBox } from '@components/component-row-box';
import { sceneSettingsManager } from '@managers/settings-manager';

export const SceneSettingsMenu = () => {
    const { raw: settings } = useSceneSettings();
    const [currentSection, setCurrentSection] = useState<string>();

    const handleSectionClick = (key: string) => {
        setCurrentSection((prev) => (key !== prev ? key : undefined));
    };

    const section =
        currentSection && currentSection in settings
            ? settings[currentSection as keyof typeof settings]
            : null;

    return (
        <div className={clsx(s['menu-wrapper'])}>
            <div className={clsx(s['sections-box'])}>
                {Object.entries(settings).map(
                    ([key, section]) =>
                        section.visible && (
                            <button
                                key={key}
                                type='button'
                                className={clsx(
                                    s['section'],
                                    key === currentSection && s['current'],
                                )}
                                title={section.title}
                                onClick={
                                    () => handleSectionClick(key)
                                }>
                                {section.iconName && (
                                    <SvgIcon
                                        iconName={section.iconName}
                                        size={'medium'}
                                    />
                                )}
                            </button>
                        ),
                )}
            </div>
            {currentSection && section && (
                <div className={clsx(s['settings-menu'])}>
                    <ComponentRowBox
                        left={[<h2>{section.title}</h2>]}
                        right={[
                            <IconButton
                                iconName='cross'
                                title='Закрыть'
                                onClick={() => handleSectionClick(currentSection)}
                            />,
                        ]}
                    />
                    <div className={clsx(s['menu-content'])}>
                        {Object.entries(section.items).map(([key, item]) => (
                            <SettingsItem
                                key={key}
                                item={item}
                                path={`${currentSection}.${key}`}
                                manager={sceneSettingsManager}
                                parentDisabled={section.disabled}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
