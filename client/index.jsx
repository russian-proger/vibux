import React from 'react';
import { createRoot } from 'react-dom/client';

import './socket';

function App() {
    return (
        <div>
            <span>COol!</span>
        </div>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);