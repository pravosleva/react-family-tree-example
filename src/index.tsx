import './vars.css'
import './index.css';
import './animations.css';
import './fix.simple-react-lightbox.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import queryString from 'query-string'
import { SnackbarProvider } from 'notistack'
import { HashRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    style={{
      borderRadius: '8px',
      maxWidth: '430px',
    }}
  >
    <HashRouter>
      <QueryParamProvider 
        adapter={ReactRouter6Adapter}
        // NOTE: See also https://www.npmjs.com/package/query-string#api
        options={{
          searchStringToObject: (searchStr) => queryString.parse(searchStr, { arrayFormat: 'separator', arrayFormatSeparator: ',' }),
          objectToSearchString: (obj) => queryString.stringify(obj, { arrayFormat: 'separator', arrayFormatSeparator: ',' }),
        }}
      >
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </QueryParamProvider>
    </HashRouter>
  </SnackbarProvider>
);
