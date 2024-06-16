import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './router.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
