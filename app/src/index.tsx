import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import BottomController from './components/BottomController';
import MainContent from './components/MainContent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainContent />
    <BottomController />
  </React.StrictMode>
);