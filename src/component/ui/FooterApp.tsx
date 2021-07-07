import React from "react";
import Grid from "@material-ui/core/Grid";
import SvgIcon from "component/ui/SvgIcon";

function FooterApp() {
  return (
    <div className="footer">
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <SvgIcon icon="settings" />
        </Grid>
        <Grid item xs={2}>
          <SvgIcon icon="edit" />
        </Grid>
        <Grid item xs={2}>
          <SvgIcon icon="microphone" />
        </Grid>
        <Grid item xs={2}>
          <SvgIcon icon="library" />
        </Grid>
        <Grid item xs={2}>
          <SvgIcon icon="cut" />
        </Grid>
        <Grid item xs={2}>
          <SvgIcon icon="world_map" />
        </Grid>
      </Grid>
    </div>
  );
}

export default FooterApp;
