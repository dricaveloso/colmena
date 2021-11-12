/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import { hasExclusivePath } from "@/utils/directory";
import { NotificationStatusEnum } from "@/enums/*";
import { removeCornerSlash } from "@/utils/utils";
import theme from "@/styles/theme";
import { FileIcon } from "react-file-icon";
import ContextMenuOptions from "./ContextMenuOptions";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "react-i18next";

interface CarItemInterface extends LibraryItemInterface {
  orientation: string | ["vertical", "horizontal"];
}

const CardItem = ({
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
}: CarItemInterface) => {
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
      key="share"
      icon="share"
      color="#9A9A9A"
      style={{ padding: 0, margin: 0, minWidth: 30 }}
      fontSizeIcon="small"
      handleClick={unavailable}
    />
  );
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
            extension={extension}
            foldColor={theme.palette.primary.dark}
            glyphColor="#fff"
            color={theme.palette.primary.main}
            labelColor={theme.palette.primary.dark}
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

    options.push(
      <ContextMenuOptions
        id={id}
        type={type}
        filename={filename ?? ""}
        environment={environment}
      />,
    );
  }

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          avatar={avatar}
          primary={basename}
          secondary={createdAtDescription}
          options={options}
          handleClick={handleClick}
        />
      ) : (
        <GridItemList
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
