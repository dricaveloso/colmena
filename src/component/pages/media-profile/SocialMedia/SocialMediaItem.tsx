/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import SvgIcon from "@/components/ui/SvgIcon";
import { AllIconProps } from "@/types/*";
import { makeStyles } from "@material-ui/core/styles";
import Clickable from "@/components/ui/Clickable";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import { useTranslation } from "react-i18next";
import theme from "@/styles/theme";
import ActionConfirm from "@/components/ui/ActionConfirm";
import { capitalizeFirstLetter } from "@/utils/utils";
import { isSubadminProfile } from "@/utils/permissions";

type Props = {
  title: string;
  icon: AllIconProps;
  fontSize?: number;
  iconColor?: string;
  handleDelete: (name: string) => Promise<void>;
  handleEdit: () => void;
  handleShow: () => void;
};

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.dark,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    width: 70,
  },
  iconRemove: {
    color: theme.palette.danger.light,
  },
}));

export default function SocialMediaItem({
  title,
  icon,
  fontSize = 64,
  iconColor = "#343A40",
  handleDelete,
  handleEdit,
  handleShow,
}: Props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { t } = useTranslation("mediaProfile");
  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteIntern = () => {
    setOpenConfirmation(false);
    handleDelete(title);
  };

  return (
    <Box className={classes.container}>
      {openConfirmation && (
        <ActionConfirm onOk={handleDeleteIntern} onClose={() => setOpenConfirmation(false)} />
      )}
      <Clickable handleClick={isSubadminProfile() ? handleOpenContextMenu : handleShow}>
        <SvgIcon icon={icon} style={{ fontSize }} htmlColor={iconColor} />
        <Text
          variant={TextVariantEnum.SUBTITLE1}
          display={TextDisplayEnum.BLOCK}
          noWrap
          className={classes.title}
        >
          {capitalizeFirstLetter(title)}
        </Text>
      </Clickable>
      <Menu
        key={uuid()}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorReference="anchorPosition"
        anchorPosition={
          position.mouseY !== null && position.mouseX !== null
            ? { top: position.mouseY, left: position.mouseX }
            : undefined
        }
        onClose={handleCloseContextMenu}
      >
        <MenuItem
          key="show"
          data-testid="social-media-show"
          onClick={() => {
            handleCloseContextMenu();
            handleShow();
          }}
        >
          <ContextMenuItem icon="show" title={t("socialMediaContextMenuOptions.open")} />
        </MenuItem>
        <MenuItem
          key="edit"
          data-testid="social-media-edit"
          onClick={() => {
            handleCloseContextMenu();
            handleEdit();
          }}
        >
          <ContextMenuItem icon="edit" title={t("socialMediaContextMenuOptions.edit")} />
        </MenuItem>
        <MenuItem
          key="remove"
          data-testid="social-media-remove"
          onClick={() => {
            handleCloseContextMenu();
            setOpenConfirmation(true);
          }}
          className={classes.iconRemove}
        >
          <ContextMenuItem
            iconColor={theme.palette.danger.light}
            icon="trash"
            title={t("socialMediaContextMenuOptions.delete")}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
