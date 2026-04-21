import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@pages/layout';
import { ComplexPage } from '@pages/complex-page';
import { HomePage } from '@pages/home-page';
import { AuthPage } from '@pages/auth-page';
import { ProtectedRoute } from '@pages/protected-route';
import { ComplexesPage } from '@pages/complexes-page';
import { MastConfigsPage } from '@pages/mast-configs-page';

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/auth',
                element: <AuthPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/complex',
                        element: <ComplexPage />,
                    },
                    {
                        path: 'complexes',
                        element: <ComplexesPage />,
                    },
                    {
                        path: 'mast-configs',
                        element: <MastConfigsPage />,
                    },
                ],
            },
        ],
    },
]);
