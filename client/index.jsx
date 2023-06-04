import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div>
            <span>COol!</span>
        </div>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);