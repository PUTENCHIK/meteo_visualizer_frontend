import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@context/theme-context/index.tsx';
import { RouterProvider } from 'react-router-dom';
import { AppRouter } from '@pages/router/index.tsx';
import '@styles/global.css';
import '@styles/consts.css';
import '@styles/colors.css';
import '@styles/font-sizes.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import { Suspense } from 'react';
import { Loader } from '@components/loader';
import { WebSocketProvider } from '@context/websocket-context';
import { PanelProvider } from '@context/panel-context';
import { ProviderComposer } from '@context/provider-composer';
import { SceneProvider } from '@context/scene-context';
import { BridgeProvider } from '@context/bridge-context';
import { FiberProvider } from 'its-fine';
import { DevicesProvider } from '@context/devices-context';
import { DialogProvider } from '@context/dialog-context';
import { AuthProvider } from '@context/auth-context';
import { QueryProvider } from '@context/query-context';

const providers = [
    FiberProvider,
    ThemeProvider,
    QueryProvider,
    AuthProvider,
    DialogProvider,
    PanelProvider,
    DevicesProvider,
    WebSocketProvider,
    SceneProvider,
    BridgeProvider,
];

createRoot(document.getElementById('root')!).render(
    <ProviderComposer providers={providers}>
        <Suspense fallback={<Loader />}>
            <RouterProvider router={AppRouter} />
        </Suspense>
    </ProviderComposer>,
);
