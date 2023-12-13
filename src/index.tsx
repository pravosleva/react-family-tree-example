import './vars.css'
import './index.css';
import './animations.css';
import './fix.simple-react-lightbox.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';

createRoot(document.getElementById('root')!).render(<App />);
