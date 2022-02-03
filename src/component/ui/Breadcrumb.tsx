import React, { useRef, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import { makeStyles } from "@material-ui/core";
import { moveScrollToRight } from "@/utils/utils";

type Props = {
  breadcrumbs: Array<BreadcrumbItemInterface>;
  handleNavigate: (dir: BreadcrumbItemInterface) => void;
  isDisabled?: boolean;
};

const useStyles = makeStyles(() => ({
  breadcrumb: {
    overflowY: "hidden",
    "& .MuiBreadcrumbs-ol": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "nowrap",
      alignContent: "center",
      padding: 0,
      margin: 0,
      alignSelf: "stretch",
      flexGrow: 1,
      "& .MuiBreadcrumbs-li": {
        whiteSpace: "nowrap",
      },
      "& .MuiBreadcrumbs-separator": {
        marginLeft: "2px",
        marginRight: "2px",
      },
      "& .MuiButton-root": {
        textTransform: "inherit",
      },
    },
  },
}));

function Breadcrumb({ breadcrumbs, handleNavigate, isDisabled = false }: Props) {
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  useEffect(() => moveScrollToRight(breadcrumbRef), [breadcrumbRef.current?.scrollWidth]);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={classes.breadcrumb}
      separator="›"
      ref={breadcrumbRef}
    >
      {breadcrumbs.map((dir: BreadcrumbItemInterface) => {
        if (dir.icon !== undefined) {
          return (
            <Button
              key={dir.path}
              color="primary"
              component="a"
              disabled={dir.isCurrent || isDisabled}
              onClick={() => handleNavigate(dir)}
              style={{ padding: "8px 12px", minWidth: "auto" }}
            >
              /
            </Button>
          );
        }

        return (
          <Button
            key={dir.path}
            style={{ color: dir.isCurrent ? "#999" : "#292929" }}
            disabled={dir.isCurrent || isDisabled}
            onClick={() => handleNavigate(dir)}
          >
            {dir.description}
          </Button>
        );
      })}
    </Breadcrumbs>
  );
}

export default Breadcrumb;
