import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    icon: Palette["primary"];
  }
  interface PaletteOptions {
    icon: PaletteOptions["primary"];
  }
}

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
    icon: {
      light: "#a4a4a4",
      main: "#757575",
      dark: "#494949",
    },
  },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
