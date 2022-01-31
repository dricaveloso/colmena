import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    icon: Palette["primary"];
    variation3: Palette["primary"];
    variation4: Palette["primary"];
    variation1: Palette["primary"];
    variation2: Palette["primary"];
    variation6: Palette["primary"];
    danger: Palette["primary"];
    variation5: Palette["primary"];
  }
  interface PaletteOptions {
    icon: PaletteOptions["primary"];
    variation1: PaletteOptions["primary"];
    variation3: PaletteOptions["primary"];
    variation4: PaletteOptions["primary"];
    variation2: PaletteOptions["primary"];
    variation6: PaletteOptions["primary"];
    danger: PaletteOptions["primary"];
    variation5: PaletteOptions["primary"];
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
    variation1: {
      light: "#b3e7e7",
      main: "#00aeaf",
      dark: "#009496",
      contrastText: "#fff",
    },
    variation2: {
      light: "#5B2DAC",
      main: "#8E6BC5",
      dark: "#5B2DAC",
      contrastText: "#fff",
    },
    variation3: {
      light: "#fbe1b7",
      main: "#f39b10",
      dark: "#ed7f09",
      contrastText: "#fff",
    },
    variation4: {
      light: "#cdf3dd",
      main: "#57D88F",
      dark: "#3cc872",
      contrastText: "#fff",
    },
    variation5: {
      light: "#c0c3c5",
      main: "#2c363e",
      dark: "#1b2228",
      contrastText: "#fff",
    },
    variation6: {
      light: "#c2c4c6",
      main: "#343a40",
      dark: "#21252a",
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
