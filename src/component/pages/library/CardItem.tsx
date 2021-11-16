/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { LibraryCardItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import {
  hasExclusivePath,
  getPublicPath,
  getPrivatePath,
  getOfflinePath,
  isRootPath,
} from "@/utils/directory";
import { NotificationStatusEnum } from "@/enums/*";
import { removeCornerSlash } from "@/utils/utils";
import theme from "@/styles/theme";
import FileIcon from "@/components/ui/FileIcon";
import ContextMenuOptions from "./contextMenu";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "react-i18next";
import { AllIconProps } from "@/types/index";

const CardItem = (cardItem: LibraryCardItemInterface) => {
  const {
    id,
    basename,
    filename,
    environment,
    createdAt,
    createdAtDescription,
    tags,
    type,
    arrayBufferBlob,
    image,
    extension,
    orientation,
    mime,
    size,
  } = cardItem;
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);
  const { t: c } = useTranslation("common");

  const handleClick = () => {
    if (type === "directory" && router.query.path !== filename) {
      router.push(`/library/${filename}`);
    }
  };

  const unavailable = () => {
    notificationCtx.showNotification({
      message: c("featureUnavailable"),
      status: NotificationStatusEnum.WARNING,
    });
  };

  const options = [];
  const bottomOptions = [];
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

  let folderSecondIcon: AllIconProps | null | undefined = null;
  if (type === "directory") {
    switch (filename) {
      case getPublicPath():
        folderSecondIcon = "global";
        break;
      case getPrivatePath():
        folderSecondIcon = "private";
        break;
      case getOfflinePath():
        folderSecondIcon = "offline";
        break;
      default:
        if (filename && filename.indexOf("/") < 0) {
          folderSecondIcon = "panal";
        }
        break;
    }
  }

  const avatar = (
    <>
      {image !== undefined ? (
        <Image
          alt={`image-${basename}-${id}`}
          width={60}
          height={60}
          src={image}
          onClick={() => handleClick()}
        />
      ) : (
        <Box width={60} px={1} onClick={() => handleClick()}>
          <FileIcon
            folderSecondIcon={folderSecondIcon}
            extension={extension}
            environment={environment}
            mime={mime}
            type={type === "directory" ? type : "file"}
          />
        </Box>
      )}
    </>
  );

  if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
    if (orientation === "vertical") {
      options.push(shareOption);
    } else {
      bottomOptions.push(shareOption);
    }

    options.push(<ContextMenuOptions key={`${basename}-more-options`} {...cardItem} />);
  }

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={createdAtDescription}
          options={options}
          handleClick={handleClick}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={createdAtDescription}
          topOptions={options}
          bottomOptions={bottomOptions}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default CardItem;
