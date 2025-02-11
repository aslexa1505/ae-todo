import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'App';

import 'styles/global.scss';

const rootElement = document.getElementById('root');

const TodoApp: React.FC = () => (
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);

if (rootElement) {
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(<TodoApp />);
} else {
    console.error('Root element not found!');
}

export default TodoApp;
