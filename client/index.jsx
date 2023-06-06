import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";


import Index from './pages/index.jsx';
import Conference from './pages/conference.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />
    },
    {
        path: '/conference/:id',
        element: <Conference />
    }
]);

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);