import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
  },
  palette: {
    primary: {
      light: "#6865B7",
      main: "#534BAE",
      dark: "#4D43A5",
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
