import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Paper } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { useRouter } from "next/router";

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

function TabsDashboard({ title1, title2 }: Props) {
  const classes = useStyles();
  const router = useRouter();
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
          <Tab icon={<HelpOutlineIcon fontSize="large" />} label={title1} />
          <Tab
            onClick={() => router.push("/library")}
            icon={<LibraryMusicIcon fontSize="large" />}
            label={title2}
          />
        </Tabs>
      </Paper>
    </div>
  );
}

export default TabsDashboard;
