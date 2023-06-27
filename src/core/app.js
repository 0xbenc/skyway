import React, { useMemo } from 'react';
import HandlePages from './pages';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useStore } from './zustand';
import { light, dark } from "./mui/theme";

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