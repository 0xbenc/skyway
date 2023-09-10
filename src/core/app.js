import React, { useMemo } from 'react';
//
import { useStore } from './zustand';
//
import { light, dark } from "./mui/theme";
import HandlePages from './pages';
import HandleIPC from './ipc';
import IntegrationNotistack from './notifications';
//
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
// ----------------------------------------------------------------------

const App = () => {
  const color_mode = useStore(state => state.color_mode);

  const theme = useMemo(
    () =>
      createTheme(color_mode === "light" ? light : dark),
    [color_mode, light, dark],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HandlePages />
      <HandleIPC />
      <IntegrationNotistack />
    </ThemeProvider>
  );
}

export default App;