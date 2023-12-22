import * as React from 'react';
//
import { createRoot } from 'react-dom/client';
//
import { App } from './app';
//
import { StyledEngineProvider } from '@mui/material/styles';
// ----------------------------------------------------------------------

const container = document.getElementById('skyway');
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>
);
