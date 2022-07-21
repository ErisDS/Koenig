import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
    HashRouter,
    Routes,
    Route
} from 'react-router-dom';

function init() {
    const root = ReactDOM.createRoot(document.querySelector('[data-koenig]'));
    root.render(
        <HashRouter>
            <Routes>
                <Route path="/post/:id" element={<App />} />
            </Routes>
        </HashRouter>
    );
}

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

