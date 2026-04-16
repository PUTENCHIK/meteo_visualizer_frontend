import clsx from 'clsx';
import s from './auth-page.module.scss';
import { TabsMenu } from '@components/tabs-menu';
import { useState } from 'react';
import { SigninForm } from '@forms/signin-form';
import { SignupForm } from '@forms/signup-form';

export const AuthPage = () => {
    const authTabs = {
        signin: 'Вход',
        signup: 'Регистрация',
    };
    const [currentTab, setCurrentTab] = useState<keyof typeof authTabs>('signin');

    return (
        <div className={clsx(s['main'])}>
            <div className={clsx(s['container'])}>
                <h1 className={clsx(s['title'])}>MeteoVisualizer</h1>
                <p className={clsx(s['description'])}>
                    Сервис мизуализации измерений системы комплесов МАМКА
                </p>
            </div>
            <div className={clsx(s['container'], s['forms'])}>
                <TabsMenu current={currentTab} tabs={authTabs} onChange={setCurrentTab} />

                {currentTab === 'signin' ? <SigninForm /> : <SignupForm />}
            </div>
        </div>
    );
};
