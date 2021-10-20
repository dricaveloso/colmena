import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
  },
  palette: {
    primary: {
      light: "#8577e1",
      main: "#534bae",
      dark: "#1b237e",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff73ad",
      main: "#d53e7e",
      dark: "#9f0052",
      contrastText: "#fff",
    },
  },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
