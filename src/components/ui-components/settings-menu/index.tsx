import clsx from 'clsx';
import s from './settings-menu.module.scss';
import { SvgIcon } from '@components/svg-icon';
import { useState } from 'react';
import { SettingsItem } from '@components/settings-item';
import { useSettings } from '@context/use-settings';
import { IconButton } from '@components/icon-button';
import { ComponentHeader } from '@components/component-header';

export const SettingsMenu = () => {
    const { raw: settings } = useSettings();
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
                                disabled={section.disabled}
                                onClick={
                                    !section.disabled ? () => handleSectionClick(key) : undefined
                                }>
                                <SvgIcon
                                    iconName={section.iconName}
                                    size={24}
                                    disabled={section.disabled}
                                />
                            </button>
                        ),
                )}
            </div>
            {currentSection && section && (
                <div className={clsx(s['settings-menu'])}>
                    <ComponentHeader
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
                            <SettingsItem key={key} path={`${currentSection}.${key}`} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
