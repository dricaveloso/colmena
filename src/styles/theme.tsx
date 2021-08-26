import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Condensed, sans-serif",
  },
  palette: {
    primary: {
      light: "#78e5c6",
      main: "#42B295",
      dark: "#008267",
      contrastText: "#fff",
    },
    secondary: {
      light: "#60ad5e",
      main: "#2e7d32",
      dark: "#005005",
      contrastText: "#fff",
    },
  },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
