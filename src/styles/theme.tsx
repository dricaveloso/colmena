import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    icon: Palette["primary"];
    orange: Palette["primary"];
    green: Palette["primary"];
    ciano: Palette["primary"];
    purple: Palette["primary"];
    danger: Palette["primary"];
  }
  interface PaletteOptions {
    icon: PaletteOptions["primary"];
    ciano: PaletteOptions["primary"];
    orange: PaletteOptions["primary"];
    green: PaletteOptions["primary"];
    purple: PaletteOptions["primary"];
    danger: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Nunito Sans, Open Sans, sans-serif",
  },
  palette: {
    primary: {
      light: "#c9cbd9",
      main: "#4c517f",
      dark: "#333762",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fbe1b7",
      main: "#f39b10",
      dark: "#ed7f09",
      contrastText: "#fff",
    },
    ciano: {
      light: "#b3e7e7",
      main: "#00aeaf",
      dark: "#009496",
      contrastText: "#fff",
    },
    purple: {
      light: "#5B2DAC",
      main: "#8E6BC5",
      dark: "#5B2DAC",
      contrastText: "#fff",
    },
    orange: {
      light: "#fbe1b7",
      main: "#f39b10",
      dark: "#ed7f09",
      contrastText: "#fff",
    },
    green: {
      light: "#cdf3dd",
      main: "#57D88F",
      dark: "#3cc872",
      contrastText: "#fff",
    },
    icon: {
      light: "#a4a4a4",
      main: "#757575",
      dark: "#494949",
    },
    danger: {
      light: "#f94d4d",
      main: "#d10000",
      dark: "#ad0000",
    },
  },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
