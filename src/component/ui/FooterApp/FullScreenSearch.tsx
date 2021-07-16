import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import FlexBox from "@/components/ui/FlexBox";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(
  (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function FullScreenSearch({ open, handleClose }: Props) {
  const classes = useStyles();

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <div onClick={handleClose}>
            <SvgIcon icon="close" htmlColor="white" fontSize="small" />
          </div>
          <input
            type="text"
            placeholder="Search ..."
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              padding: 10,
              marginRight: 8,
              marginLeft: 8,
              width: "100%",
              border: "none",
            }}
          />
          <SvgIcon icon="search" htmlColor="white" fontSize="small" />
        </Toolbar>
      </AppBar>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <SvgIcon icon="search" style={{ fontSize: "5em", marginBottom: 15 }} />
          <Text variant={TextVariantEnum.SUBTITLE1}>Search in Colmena.media</Text>
        </Box>
      </FlexBox>
    </Dialog>
  );
}
