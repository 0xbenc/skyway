import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './app';

const container = document.getElementById('skyway');
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>
);