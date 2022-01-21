import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

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
    <div className={classes.loading}>
      <CircularProgress color="secondary" />
      {description && <Typography className={classes.description}>{description}</Typography>}
    </div>
  );
};

export default Loading;
