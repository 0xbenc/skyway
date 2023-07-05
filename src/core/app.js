import React, { useMemo } from 'react';
//
import { useStore } from './zustand';
//
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
//
import { light, dark } from "./mui/theme";
import HandlePages from './pages';

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
    </ThemeProvider>
  );
}

export default App;