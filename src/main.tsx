import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 如果 Vite 项目自动生成了 index.css，可以在这里 import './index.css'; 
// 但因为我们用了 Tailwind CDN，所以暂时不需要。

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);