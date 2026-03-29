import clsx from 'clsx';
import s from './settings-menu.module.scss';
import { SvgIcon } from '@components/svg-icon';
import { useState } from 'react';
import { SettingsItem } from '@components/settings-item';
import { useSettings } from '@context/use-settings';

export const SettingsMenu = () => {
    const { raw: settings } = useSettings();
    const [currentSection, setCurrentSection] = useState<string>();

    const handleSectionClick = (key: string) => {
        setCurrentSection(key !== currentSection ? key : undefined);
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
                            <div
                                key={key}
                                className={clsx(
                                    s['section'],
                                    key === currentSection && s['current'],
                                )}
                                title={section.title}
                                onClick={() => handleSectionClick(key)}>
                                <SvgIcon iconName={section.iconName} size={24} />
                            </div>
                        ),
                )}
            </div>
            {currentSection && section && (
                <div className={clsx(s['settings-menu'])}>
                    <div className={clsx(s['menu-content'])}>
                        <h2>{section.title}</h2>
                        {Object.entries(section.items).map(([key, item]) => (
                            <SettingsItem key={key} path={`${currentSection}.${key}`} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
