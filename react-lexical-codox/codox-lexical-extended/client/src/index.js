import './lexical/index.css';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './lexical/App';
// import AppMinimal from './lexical/AppMinimal';

createRoot(document.getElementById('root')).render(
  <App />
  // <AppMinimal />
  // NOTE: strict mode disabled - causes remounting everything twice
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);
