import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

let theme: Theme = createMuiTheme({
  typography: {
    caption: {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
