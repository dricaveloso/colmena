/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import {
  LibraryCardItemInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ContextMenuOptionEnum, ListTypeEnum, OrderEnum, TextVariantEnum } from "@/enums/index";
import Library, { getItems, orderItems } from "@/components/pages/library";
import { PropsUserSelector } from "@/types/*";
import ToolbarSection from "../ToolbarSection";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";
import { removeCornerSlash, isAudioFile } from "@/utils/utils";
import { v4 as uuid } from "uuid";
import ContextMenuOptions from "@/components/pages/library/contextMenu";
import { getAudioPath, hasExclusivePath, pathIsInFilename } from "@/utils/directory";
import IconButton from "@/components/ui/IconButton";
import Text from "@/components/ui/Text";
import { Grid, Box } from "@material-ui/core";
import { toast } from "@/utils/notifications";

const RecentFiles: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<LibraryItemInterface>>();
  const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });

  const { t: homeTranslation } = useTranslation("home");

  const mountItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await getItems(userRdx.user.id, userRdx.user.id, timeDescription, l);
      const recentFiles = orderItems(OrderEnum.LATEST_FIRST, items)
        .filter((item) => item.type !== "directory")
        .slice(0, 3);
      setData(recentFiles);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountItems();
    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleItemClick = ({ type, aliasFilename, filename }: LibraryCardItemInterface) => {
    if (type === "directory" && router.query.path !== aliasFilename) {
      router.push(`/library/${aliasFilename}`);
    } else if (type === "file") {
      router.push(`/file/${btoa(filename)}`);
    }
  };

  const unavailable = () => {
    toast(t("featureUnavailable"), "warning");
  };

  const handleContextMenuUpdate = async () => {
    await mountItems();
  };

  const options = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
  ) => {
    const { filename, basename, orientation, mime } = cardItem;
    const options = [];
    const shareOption = (
      <IconButton
        key={`${uuid()}-share`}
        icon="share"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={unavailable}
      />
    );

    if (playIconComp) options.push(playIconComp);

    if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
      if (!pathIsInFilename(getAudioPath(), filename) && orientation === "vertical") {
        if (!isAudioFile(mime)) {
          options.push(shareOption);
        }
      }

      options.push(
        <ContextMenuOptions
          key={`${basename}-more-options`}
          {...cardItem}
          availableOptions={[
            ContextMenuOptionEnum.EDIT,
            ContextMenuOptionEnum.COPY,
            ContextMenuOptionEnum.MOVE,
            ContextMenuOptionEnum.DETAILS,
            ContextMenuOptionEnum.AVAILABLE_OFFLINE,
            ContextMenuOptionEnum.DOWNLOAD,
            ContextMenuOptionEnum.DELETE,
            ContextMenuOptionEnum.DUPLICATE,
            ContextMenuOptionEnum.PUBLISH,
            ContextMenuOptionEnum.RENAME,
          ]}
          onChange={handleContextMenuUpdate}
        />,
      );
    }

    return options;
  };

  const bottomOptions = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
    badgeStatusGrid: React.ReactNode | undefined = undefined,
  ) => {
    const { filename, basename, orientation } = cardItem;
    const options = [];
    if (playIconComp) options.push(playIconComp);

    const shareOption = (
      <IconButton
        key={`${basename}-share`}
        icon="share"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={unavailable}
      />
    );

    if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
      if (!pathIsInFilename(getAudioPath(), filename) && orientation === "horizontal") {
        options.push(shareOption);
      }
    }

    if (badgeStatusGrid) options.push(badgeStatusGrid);

    return options;
  };

  return (
    <Box width="100%" data-testid="ui-recent-files">
      <Grid>
        <ToolbarSection
          title={homeTranslation("section4Title")}
          link={`/library/${userRdx.user.id}`}
        />
      </Grid>
      {isLoading && <DirectoryList quantity={3} />}
      {!isLoading && data && data?.length > 0 && (
        <Library
          items={data}
          options={options}
          bottomOptions={bottomOptions}
          handleItemClick={handleItemClick}
          listType={ListTypeEnum.LIST}
          isLoading={isLoading}
        />
      )}
      {!isLoading && data && data?.length === 0 && (
        <Box style={{ backgroundColor: "#fff" }} padding={2}>
          <Text style={{ textAlign: "left" }} variant={TextVariantEnum.BODY2}>
            {t("noItemsFound")}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default RecentFiles;
