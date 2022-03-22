import { currentDirection } from "@/utils/i18n";
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

import colors from "./colors";

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
    ...colors,
  },
  direction: currentDirection(),
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
