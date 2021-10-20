import React, { useRef, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import { useRouter } from "next/router";
import { Box, makeStyles } from "@material-ui/core";
import { moveScrollToRight } from "@/utils/utils";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";

type Props = {
  breadcrumbs: Array<BreadcrumbItemInterface>;
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
    },
  },
}));

function Breadcrumb({ breadcrumbs }: Props) {
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const router = useRouter();

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
            <IconButton
              key={dir.path}
              color="primary"
              component="span"
              disabled={dir.isCurrent}
              onClick={() => router.push(dir.path)}
            >
              <SvgIcon
                icon={dir.icon}
                htmlColor={dir.isCurrent ? "#999" : "#292929"}
                fontSize="small"
              />
              {dir.description && (
                <Box fontSize="medium" ml={1} color="#999">
                  {dir.description}
                </Box>
              )}
            </IconButton>
          );
        }

        return (
          <Button
            key={dir.path}
            style={{ color: dir.isCurrent ? "#999" : "#292929" }}
            disabled={dir.isCurrent}
            onClick={() => router.push(dir.path)}
          >
            {dir.description}
          </Button>
        );
      })}
    </Breadcrumbs>
  );
}

export default Breadcrumb;
