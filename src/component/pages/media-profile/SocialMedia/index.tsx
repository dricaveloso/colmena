import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "@/components/ui/GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import { isSubadminProfile, getUserGroup } from "@/utils/permissions";
import SocialMediaItem from "./SocialMediaItem";
import { makeStyles } from "@material-ui/core/styles";
import Create from "./create";
import Edit from "./edit";
import { ConfigFilesNCEnum } from "@/enums/*";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { SocialMediaInfoInterface, MediaInfoInterface } from "@/interfaces/index";
import { getAvailableSocialMedias } from "@/utils/utils";
import { toast } from "@/utils/notifications";
import Backdrop from "@/components/ui/Backdrop";
import { listFile, putFile } from "@/services/webdav/files";
import { mediaInfoUpdate } from "@/store/actions/users/index";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 1,
    backgroundColor: "#fff",
  },
  mediaDescription: {
    backgroundColor: "#fff",
    textAlign: "left",
    width: "100%",
    padding: 10,
    paddingLeft: 15,
  },
  plusButton: {
    marginRight: 8,
    marginBottom: 25,
  },
}));

export default function SocialMedia() {
  const classes = useStyles();
  const { t } = useTranslation("mediaProfile");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [socialMediaSelected, setSocialMediaSelected] = useState<SocialMediaInfoInterface | null>(
    null,
  );
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [loadingRemoveSocialMedia, setLoadingRemoveSocialMedia] = useState(false);
  const dispatch = useDispatch();

  const showModal = () => {
    const smn =
      userRdx.user.media && userRdx.user.media.social_medias
        ? userRdx.user.media.social_medias.length
        : 0;
    if (smn < getAvailableSocialMedias().length) {
      setOpenCreateModal(true);
      return;
    }
    toast(t("socialMediaAlreadyRegistered"), "warning");
  };

  const removeSocialMedia = async (name: string) => {
    try {
      setLoadingRemoveSocialMedia(true);
      const mediaName = getUserGroup();
      const mediaFile = await listFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
        null,
        true,
      );
      const mediaObj: MediaInfoInterface = JSON.parse(String(mediaFile));

      let socialMediasFiltered = [];
      if (mediaObj.social_medias && Array.isArray(mediaObj.social_medias)) {
        socialMediasFiltered = mediaObj.social_medias.filter((item) => item.name !== name);
        mediaObj.social_medias = socialMediasFiltered;
      }

      await putFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
        JSON.stringify(mediaObj),
      );

      dispatch(mediaInfoUpdate(mediaObj));
      toast(t("socialMediaInfoRemoved"), "success");
    } catch (e) {
      console.log(e);
      toast(t("genericErrorMessage"), "error");
    } finally {
      setLoadingRemoveSocialMedia(false);
    }
  };

  const handleShow = (url: string) => {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.setAttribute("target", "blank");
    anchor.click();
  };

  return (
    <Box width="100%">
      <Backdrop open={loadingRemoveSocialMedia} />
      <ToolbarSection showRightButton={false} title={t("socialMediaTitle")} />
      <Divider marginTop={10} />
      <Box className={classes.container}>
        {isSubadminProfile() && (
          <IconButton
            icon="plus_circle"
            data-testid="add-social-media-media"
            iconColor={theme.palette.variation1.main}
            iconStyle={{ fontSize: 64 }}
            fontSizeIcon="large"
            handleClick={showModal}
            className={classes.plusButton}
            textStyle={{
              color: theme.palette.primary.dark,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 14,
            }}
          />
        )}
        <GalleryHorizontalScroll>
          {userRdx.user.media?.social_medias?.map((item: SocialMediaInfoInterface) => (
            <SocialMediaItem
              title={item.name}
              icon={item.name}
              fontSize={64}
              iconColor={theme.palette.variation6.main}
              handleDelete={removeSocialMedia}
              handleEdit={() => {
                setSocialMediaSelected(item);
                setOpenEditModal(true);
              }}
              handleShow={() => handleShow(item.url)}
            />
          ))}
        </GalleryHorizontalScroll>
        <Create
          title={t("addSocialMediaTitle")}
          open={openCreateModal}
          handleClose={() => setOpenCreateModal(false)}
        />
        <Edit
          title={t("updateSocialMediaTitle")}
          open={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          socialMediaSelected={socialMediaSelected}
        />
      </Box>
    </Box>
  );
}
