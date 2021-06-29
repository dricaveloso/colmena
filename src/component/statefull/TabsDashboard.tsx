import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Paper from "@material-ui/core/Paper";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
}));

function TabsDashboard({ title1, title2 }) {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
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
          <Tab icon={<HelpOutlineIcon fontSize="large" />} label={title1} />
          <Tab
            onClick={() => router.push("/mediateca")}
            icon={<LibraryMusicIcon fontSize="large" />}
            label={title2}
          />
        </Tabs>
      </Paper>
    </div>
  );
}

export default TabsDashboard;
