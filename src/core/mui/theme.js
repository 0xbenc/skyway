const light = {
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          fontSize: 14,
          fontWeight: 400
        },
      },
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 720,
      md: 1280,
      lg: 1920,
      xl: 1440,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#eee",
      light: "#fff",
      dark: "#ddd",
      contrastText: '#000',
    },
    secondary: {
      main: "#111",
      light: "#000",
      dark: '#222',
      contrastText: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#000',
      disabled: '#000'
    },
  }
};

const dark = {
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          fontSize: 14,
          fontWeight: 400
        },
      },
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 720,
      md: 1280,
      lg: 1920,
      xl: 1440,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#111",
      light: "#444",
      dark: "#000",
      contrastText: '#fff',
    },
    secondary: {
      main: "#eee",
      light: "#fff",
      dark: "#ddd",
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: '#fff'
    },
  }
};

export { light, dark };