import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import ListIcon from "@material-ui/icons/List";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

type Props = {
  title1: string;
  title2: string;
};

function TabsMediateca({ title1, title2 }: Props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper square className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<ListIcon fontSize="large" />} label={title1} />
          <Tab icon={<BookmarkBorderIcon fontSize="large" />} label={title2} />
        </Tabs>
      </Paper>
    </div>
  );
}

export default TabsMediateca;
