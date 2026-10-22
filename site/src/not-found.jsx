import React from 'react';
import { createRoot } from 'react-dom/client';
import NotFound from './NotFound.jsx';
import './styles.css';

// The 404 page (404.html).
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotFound />
  </React.StrictMode>,
);
