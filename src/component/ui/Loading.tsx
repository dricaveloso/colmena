import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";

type Props = {
  description?: string;
  textColor?: string;
  loadingColor?: string;
};

const useStyles = makeStyles((theme) => ({
  loading: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  description: {
    fontSize: "1rem",
    marginTop: theme.spacing(1),
  },
  circularProgress: {
    color: theme.palette.secondary.main,
  },
}));

const Loading = ({ description, textColor, loadingColor }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.loading}>
      <CircularProgress className={classes.circularProgress} style={{ color: loadingColor }} />
      {description && (
        <Text className={classes.description} style={{ color: textColor }}>
          {description}
        </Text>
      )}
    </Box>
  );
};

export default Loading;
