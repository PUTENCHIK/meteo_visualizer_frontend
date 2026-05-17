import clsx from 'clsx';
import s from './app-settings-menu.module.scss';
import { useAppSettings } from '@hooks/use-app-settings';
import { useState } from 'react';
import { SettingsItem } from '../settings-item';
import { SvgIcon } from '@components/svg-icon';
import { appSettingsManager } from '@managers/settings-manager';

export const AppSettingsMenu = () => {
    const { raw: settings } = useAppSettings();
    const [currentSection, setCurrentSection] = useState<string | undefined>(
        Object.keys(settings).at(0),
    );

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
                                className={clsx(
                                    s['section'],
                                    key === currentSection && s['current'],
                                )}
                                onClick={() => setCurrentSection(key)}>
                                {section.iconName && (
                                    <SvgIcon
                                        iconName={section.iconName}
                                        size={'small'}
                                        disabled={section.disabled}
                                    />
                                )}
                                {section.title}
                            </button>
                        ),
                )}
            </div>
            {currentSection && section && (
                <div className={clsx(s['menu-content'])}>
                    {Object.entries(section.items).map(([key, item]) => (
                        <SettingsItem
                            key={key}
                            item={item}
                            path={`${currentSection}.${key}`}
                            manager={appSettingsManager}
                            parentDisabled={section.disabled}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
