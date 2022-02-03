import React from "react";
import { LibraryCardItemInterface } from "@/interfaces/index";
import { EnvironmentEnum } from "@/enums/*";
import { Box, Button, ClickAwayListener, Tooltip } from "@material-ui/core";
import SvgIcon from "@/components/ui/SvgIcon";
import theme from "@/styles/theme";
import { useTranslation } from "next-i18next";

const CardItemStatus = ({ id, environment, basename }: LibraryCardItemInterface) => {
  const { t } = useTranslation("library");
  const [openTooltip, setOpenTooltip] = React.useState<boolean | string>(false);
  const status: Array<any> = [];

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = (opt: boolean | string) => {
    setOpenTooltip(opt);
  };

  /* if (environment === EnvironmentEnum.LOCAL) {
    secondaryText.push(
      <span key={`tag-${basename}-${id}`} style={{ display: "flex", marginRight: "5px" }}>
        <Badge description="offline" variant={BadgeVariantEnum.ERROR} />
      </span>,
    );
  } else */
  if (environment === EnvironmentEnum.BOTH) {
    status.push(
      <span key={`tag-${basename}-${id}`} style={{ display: "flex", padding: "0 4px" }}>
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            title={<>{t("itemStatus.availableOffline")}</>}
            onClose={handleTooltipClose}
            open={openTooltip === "sync"}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            PopperProps={{
              disablePortal: true,
            }}
            style={{ margin: "5px 0" }}
          >
            <Button
              onClick={() => handleTooltipOpen("sync")}
              variant="text"
              style={{ padding: 0, minWidth: "auto" }}
            >
              <SvgIcon icon="sync_file" fontSize={17} htmlColor={theme.palette.variation1.main} />
            </Button>
          </Tooltip>
        </ClickAwayListener>
      </span>,
    );
  }

  return (
    <>
      {status && (
        <Box component="span" display="flex" alignItems="center">
          {status.map((item) => item)}
        </Box>
      )}
    </>
  );
};

export default CardItemStatus;
