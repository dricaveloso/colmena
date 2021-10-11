import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { JustifyContentEnum, ListTypeEnum } from "@/enums/index";
import { generateBreadcrumb } from "@/utils/utils";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import Breadcrumb from "@/components/ui/Breadcrumb";
import theme from "@/styles/theme";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

type Props = {
  path: string | string[] | undefined;
  listType: string;
  setListType: React.Dispatch<React.SetStateAction<ListTypeEnum>>;
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

const defineIconListType = (type) => (type === ListTypeEnum.LIST ? "grid" : "checklist");

function HeaderBar({ path, listType, setListType }: Props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [iconListType, setIconListType] = useState(defineIconListType(listType));
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

  const openFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setAnchorEl(null);
  };

  const changeListType = () => {
    setIconListType(defineIconListType(listType));
    setListType(listType === ListTypeEnum.LIST ? ListTypeEnum.GRID : ListTypeEnum.LIST);
  };

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
        <IconButton
          color="primary"
          component="span"
          onClick={openFilterMenu}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
        </IconButton>
        <IconButton color="primary" component="span" onClick={changeListType}>
          <SvgIcon icon={iconListType} htmlColor="#292929" fontSize="small" />
        </IconButton>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeFilterMenu}
        >
          <MenuItem onClick={closeFilterMenu}>Disponible Offline</MenuItem>
          <MenuItem onClick={closeFilterMenu}>Sincronizados</MenuItem>
          <MenuItem onClick={closeFilterMenu}>Publicados</MenuItem>
          <MenuItem onClick={closeFilterMenu}>Audios</MenuItem>
          <MenuItem onClick={closeFilterMenu}>Imagenes</MenuItem>
          <MenuItem onClick={closeFilterMenu}>Texto</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default HeaderBar;
