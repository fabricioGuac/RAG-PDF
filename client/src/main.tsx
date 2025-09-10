import { createRoot } from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './utils/ProtectedRoute.tsx';
import App from './App.tsx';
import AuthPage from './pages/AuthPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PdfChatPage from './pages/PdfChatPage.tsx';

// Defines the routes to wich the components will render
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement:<ErrorPage />,
    children: [
      {
        index: true,
        element: 
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
      }, {
        path: '/auth',
        element: < AuthPage />
      },
      {
        path: '/chat',
        element: 
        <ProtectedRoute>
          < PdfChatPage />
        </ProtectedRoute>
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
    < RouterProvider router={router} />
)
