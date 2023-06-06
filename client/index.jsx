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
        path: '/conference/:id',
        element: <Conference />
    },
    {
        path: '/',
        element: <Index />
    },
]);

const root = createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);