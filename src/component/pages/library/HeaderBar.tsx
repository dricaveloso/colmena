import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { JustifyContentEnum } from "@/enums/index";
import { generateBreadcrumb } from "@/utils/utils";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import Breadcrumb from "@/components/ui/Breadcrumb";
import theme from "@/styles/theme";

type Props = {
  path: string | string[] | undefined;
};

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    flex: 1,
    textAlign: "left",
    alignSelf: "center",
    padding: 1,
    overflow: "hidden",
  },
  options: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
  },
}));

function HeaderBar({ path }: Props) {
  const { t } = useTranslation("library");
  const classes = useStyles();
  const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbItemInterface>>(
    [] as Array<BreadcrumbItemInterface>,
  );

  useEffect(() => {
    const generatedBreadcrumb = generateBreadcrumb(path, "/library");
    const firstMenu: BreadcrumbItemInterface = {
      icon: "library",
      isCurrent: generatedBreadcrumb.length === 0,
      description: generatedBreadcrumb.length === 0 ? t("title") : undefined,
      path: "/library",
    };

    setBreadcrumb([firstMenu, ...generatedBreadcrumb]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <Box
      bgcolor="#F9F9F9"
      color="text.primary"
      justifyContent={JustifyContentEnum.SPACEBETWEEN}
      flexDirection="row"
      display="flex"
      width="100%"
    >
      <Box className={classes.breadcrumb}>
        <Breadcrumb breadcrumbs={breadcrumb} />
      </Box>
      <Box className={classes.options}>
        <IconButton color="primary" component="span">
          <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
        </IconButton>
        <IconButton color="primary" component="span">
          <SvgIcon icon="grid" htmlColor="#292929" fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default HeaderBar;
