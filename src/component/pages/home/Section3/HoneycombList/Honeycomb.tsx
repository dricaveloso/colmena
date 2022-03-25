/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import { ConfigFilesNCEnum, TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";
import { makeStyles, useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getFirstLettersOfTwoFirstNames, getHoneycombPath } from "@/utils/utils";
import { createOrUpdate, findByToken } from "@/store/idb/models/honeycomb";
import { arrayBufferToBlob, blobToDataURL } from "blob-util";
import { getUnixTime, sub } from "date-fns";
import { listFile } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import ModalChangeAvatar from "@/components/pages/home/Section3/HoneycombList/ModalChangeAvatar";
import SvgIconAux from "@/components/ui/SvgIcon";
import Clickable from "@/components/ui/Clickable";

const useStyles = makeStyles((theme) => ({
  octagonWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    "-webkit-clip-path":
      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    backgroundColor: theme.palette.variation3.main,
    position: "relative",
    padding: 3,
  },
  octagon: {
    position: "relative",
    "-webkit-clip-path":
      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    minHeight: "100%",
    minWidth: "100%",
    "& div": {
      position: "unset!important",
    },
    textAlign: "center",
    backgroundColor: theme.palette.variation3.dark,
  },
  letters: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-around",
    color: "#fff",
    fontWeight: 600,
    letterSpacing: 1,
  },
  avatar: {
    position: "relative",
  },
  editAvatar: {
    position: "absolute",
    bottom: "0",
    right: "0",
  },
}));

interface Props {
  token: string;
  displayName: string;
  canDeleteConversation: boolean;
  fontSize?: number;
  width?: number;
  height?: number;
  className?: string;
  canChangeAvatar?: boolean;
}

export default function Honeycomb({
  token,
  displayName,
  canDeleteConversation,
  fontSize = 23,
  width = 64,
  height = 57,
  className,
  canChangeAvatar = false,
}: Props) {
  const classes = useStyles();
  const { t: l } = useTranslation("library");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [openAvatarUpload, setOpenAvatarUpload] = useState(false);
  const [honeycombAvatar, setHoneycombAvatar] = useState<string | undefined>();
  const lettersAvatar = getFirstLettersOfTwoFirstNames(displayName);
  const [honeycombPath, setHoneycombPath] = useState(displayName);
  const theme = useTheme();
  let bgColor;
  if (
    userRdx.user.media?.groups &&
    userRdx.user.media.groups.length > 0 &&
    userRdx.user.media.groups[0] === displayName
  ) {
    bgColor = theme.palette.variation5.main;
  }

  useEffect(() => {
    (async () => {
      const path = await getHoneycombPath(displayName, canDeleteConversation, l("talkFolderName"));
      setHoneycombPath(path);
    })();
  }, [canDeleteConversation, displayName, l]);

  const defineAvatar = async () => {
    let honeycombInStorage;
    try {
      honeycombInStorage = await findByToken(token);
      if (honeycombInStorage?.image) {
        const blob = await arrayBufferToBlob(honeycombInStorage.image);
        const file = await blobToDataURL(blob);
        setHoneycombAvatar(file);
      }
    } catch (e) {
      //
    }

    if (
      !honeycombInStorage ||
      !honeycombInStorage?.updatedAt ||
      getUnixTime(sub(new Date(), { hours: 1 })) >= honeycombInStorage.updatedAt
    ) {
      let fileContent = null;
      try {
        const blobRes: any = await listFile(
          userRdx.user.id,
          `${honeycombPath}/${ConfigFilesNCEnum.HONEYCOMB_AVATAR}`,
        );
        fileContent = blobRes;
      } catch (e) {
        //
      }

      if (fileContent) {
        const blob = await arrayBufferToBlob(fileContent);
        const file = await blobToDataURL(blob);
        setHoneycombAvatar(file);
      }

      await createOrUpdate(token, {
        name: displayName,
        image: fileContent,
        updatedAt: getUnixTime(new Date()),
      });
    }
  };

  useEffect(() => {
    (async () => {
      defineAvatar();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAvatar = async (file: ArrayBuffer) => {
    const blob = await arrayBufferToBlob(file);
    const urlFile = await blobToDataURL(blob);
    setHoneycombAvatar(urlFile);
    createOrUpdate(token, { name: displayName, image: file, updatedAt: new Date() });
    setOpenAvatarUpload(false);
  };

  return (
    <>
      <Box className={classes.avatar}>
        <Box
          width={width}
          key={uuid()}
          className={[classes.octagonWrap, className].join(" ")}
          style={{ backgroundColor: bgColor }}
        >
          <Box className={classes.octagon}>
            {honeycombAvatar ? (
              <Image width={width} height={height} src={honeycombAvatar} />
            ) : (
              <Text className={classes.letters} style={{ height, fontSize }}>
                {lettersAvatar}
              </Text>
            )}
          </Box>
        </Box>
        {canChangeAvatar && (
          <Clickable handleClick={() => setOpenAvatarUpload(true)} className={classes.editAvatar}>
            <SvgIconAux icon="edit_circle" htmlColor="#fff" fontSize={20} />
          </Clickable>
        )}
      </Box>
      <ModalChangeAvatar
        honeycombPath={honeycombPath}
        reloadAvatar={updateAvatar}
        openUpload={openAvatarUpload}
        setOpenUpload={setOpenAvatarUpload}
      />
    </>
  );
}
