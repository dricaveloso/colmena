import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createMuiTheme({
  // typography: {
  //   caption: {
  //     fontSize: 16,
  //     fontWeight: "bold",
  //   },
  // },
});

const themeRelease = responsiveFontSizes(theme);

export default themeRelease;
