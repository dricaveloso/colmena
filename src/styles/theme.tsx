import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    icon: Palette["primary"];
    danger: Palette["primary"];
  }
  interface PaletteOptions {
    icon: PaletteOptions["primary"];
    danger: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Nunito Sans, Open Sans, sans-serif",
  },
  // overrides: {
  //   MuiInputBase: {
  //     input: {
  //       "&:-webkit-autofill": {
  //         transitionDelay: "9999s",
  //         transitionProperty: "background-color, color",
  //       },
  //     },
  //   },
  // },
  palette: {
    primary: {
      light: "#6865B7",
      main: "#4c517f",
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
    danger: {
      light: "#f94d4d",
      main: "#d10000",
      dark: "#ad0000",
    },
  },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
