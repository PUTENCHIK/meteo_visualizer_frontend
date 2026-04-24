import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@pages/layout';
import { ComplexPage } from '@pages/complex-page';
import { HomePage } from '@pages/home-page';
import { AuthPage } from '@pages/auth-page';
import { ProtectedRoute } from '@pages/protected-route';
import { ComplexesPage } from '@pages/complexes-page';
import { MastConfigsPage } from '@pages/mast-configs-page';
import { UsersPage } from '@pages/users-page';
import { RolesPage } from '@pages/roles-page';

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
                        path: '/users',
                        element: <UsersPage />,
                    },
                    {
                        path: '/roles',
                        element: <RolesPage />,
                    },
                    {
                        path: 'complexes',
                        element: <ComplexesPage />,
                    },
                    {
                        path: '/complexes/:id',
                        element: <ComplexPage />,
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
