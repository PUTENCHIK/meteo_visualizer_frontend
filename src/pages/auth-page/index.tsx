import clsx from 'clsx';
import s from './auth-page.module.scss';
import { TabsMenu } from '@components/tabs-menu';
import { useState } from 'react';
import { SigninForm } from '@forms/signin-form';
import { SignupForm } from '@forms/signup-form';
import { IconButton } from '@components/icon-button';
import { useDialogs } from '@context/dialog-context';

export const AuthPage = () => {
    const { openDialog } = useDialogs();
    const authTabs = {
        signin: 'Вход',
        signup: 'Регистрация',
    };
    const [currentTab, setCurrentTab] = useState<keyof typeof authTabs>('signin');

    return (
        <div className={clsx(s['main'])}>
            <div className={clsx(s['container'], s['app-description'])}>
                <h1 className={clsx(s['title'])}>MeteoVisualizer</h1>
                <p className={clsx(s['description'])}>
                    Сервис визуализации измерений системы комплесов МАМКА
                </p>
                <img className={clsx(s['logo'])} src='./public/icon.png' alt='logo' />
                <IconButton
                    iconName='settings'
                    title='Настройки'
                    iconSize={'medium'}
                    onClick={() => openDialog('settings')}
                />
            </div>
            <div className={clsx(s['container'], s['forms'])}>
                <TabsMenu current={currentTab} tabs={authTabs} onChange={setCurrentTab} />

                {currentTab === 'signin' ? <SigninForm /> : <SignupForm />}
            </div>
        </div>
    );
};
