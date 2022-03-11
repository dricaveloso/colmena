import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";

type Props = {
  description?: string;
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
}));

const Loading = ({ description }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.loading}>
      <CircularProgress color="secondary" />
      {description && <Text className={classes.description}>{description}</Text>}
    </Box>
  );
};

export default Loading;
