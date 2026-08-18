import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root 를 찾을 수 없습니다');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
