import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {
    caption: {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
});
theme = responsiveFontSizes(theme);

export default theme;
