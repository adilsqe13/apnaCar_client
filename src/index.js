import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ToastState from './CONTEXT/state/ToastState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ToastState>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ToastState>
);

reportWebVitals();
