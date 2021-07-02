import { createMuiTheme } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const theme: Theme = createMuiTheme({
  typography: {
    caption: {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
});

export default theme;
