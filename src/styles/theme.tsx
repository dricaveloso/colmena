import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    variation1: Palette["primary"];
    variation2: Palette["primary"];
    variation3: Palette["primary"];
    variation4: Palette["primary"];
    variation5: Palette["primary"];
    variation6: Palette["primary"];
    variation7: Palette["primary"];
    variation8: Palette["primary"];
    gray: Palette["primary"];
    icon: Palette["primary"];
    danger: Palette["primary"];
  }
  interface PaletteOptions {
    variation1: PaletteOptions["primary"];
    variation2: PaletteOptions["primary"];
    variation3: PaletteOptions["primary"];
    variation4: PaletteOptions["primary"];
    variation5: PaletteOptions["primary"];
    variation6: PaletteOptions["primary"];
    variation7: PaletteOptions["primary"];
    variation8: PaletteOptions["primary"];
    gray: PaletteOptions["primary"];
    icon: PaletteOptions["primary"];
    danger: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Nunito Sans, Open Sans, sans-serif",
  },
  palette: {
    // blue
    primary: {
      light: "#c9cbd9",
      main: "#4c517f",
      dark: "#333762",
      contrastText: "#fff",
    },

    // orange
    secondary: {
      light: "#fbe1b7",
      main: "#f39b10",
      dark: "#ed7f09",
      contrastText: "#fff",
    },

    // ciano
    variation1: {
      light: "#b3e7e7",
      main: "#00aeaf",
      dark: "#009496",
      contrastText: "#fff",
    },

    // purple
    variation2: {
      light: "#5B2DAC",
      main: "#8E6BC5",
      dark: "#5B2DAC",
      contrastText: "#fff",
    },

    // orange
    variation3: {
      light: "#fbe1b7",
      main: "#f39b10",
      dark: "#ed7f09",
      contrastText: "#fff",
    },

    // light green
    variation4: {
      light: "#cdf3dd",
      main: "#57D88F",
      dark: "#3cc872",
      contrastText: "#fff",
    },

    // dark blue
    variation5: {
      light: "#c0c3c5",
      main: "#2c363e",
      dark: "#1b2228",
      contrastText: "#fff",
    },

    // dark blue variation
    variation6: {
      light: "#c2c4c6",
      main: "#343a40",
      dark: "#21252a",
      contrastText: "#fff",
    },
    // dark blue variation 2
    variation7: {
      light: "#c2c3d0",
      main: "##333762",
      dark: "#202346",
      contrastText: "#fff",
    },

    variation8: {
      light: "#fbe1b7",
      main: "#4F4F4F",
      dark: "#ed7f09",
      contrastText: "#fff",
    },

    gray: {
      light: "#e1e1e1",
      main: "#9a9a9a",
      dark: "#7e7e7e",
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
