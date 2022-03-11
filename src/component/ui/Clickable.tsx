import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    cursorPointer: {
      cursor: "pointer",
    },
  }),
);

type Props = {
  children: React.ReactNode;
  handleClick?: (...props: any | undefined) => any;
  className?: string;
  component?: React.ElementType<any> | undefined;
};

export default function Clickable({ children, handleClick, className, component = "a" }: Props) {
  const classes = useStyles();
  const classNames = [];
  if (typeof handleClick === "function") {
    classNames.push(classes.cursorPointer);
  }

  if (className) {
    classNames.push(className);
  }

  return (
    <Box component={component} className={classNames.join(" ")} onClick={handleClick}>
      {children}
    </Box>
  );
}
