import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import { Box, Fade } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: "url('/images/bg-loading.png')",
    position: "fixed",
    justifyContent: "flex-end",
  },
  loading: {
    backgroundImage: "url('/images/bg-loading-footer.png')",
    backgroundPosition: "bottom",
    backgroundRepeat: "repeat-x",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "100%",
    padding: theme.spacing(2),
    height: 200,
    textAlign: "center",
  },
}));

type Props = {
  open?: boolean;
  description?: string;
};

export default function LoadingPage({ description, open = true }: Props) {
  const classes = useStyles();

  return (
    <Dialog open={open} fullWidth>
      <Fade in={open}>
        <Box className={classes.backdrop}>
          <Box className={classes.loading}>
            <Loading description={description} textColor="#fff" loadingColor="#fff" />
          </Box>
        </Box>
      </Fade>
    </Dialog>
  );
}
