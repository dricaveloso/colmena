import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Condensed, sans-serif",
  },
  palette: {
    primary: {
      light: "#534bae",
      main: "#1a237e",
      dark: "#000051",
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
