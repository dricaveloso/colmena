import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { LibraryItemInterface } from "@/interfaces/index";
import Box from "@material-ui/core/Box";
import { Grid } from "@material-ui/core";
import Avatar from "@/components/ui/Avatar";
import DownloadModal from "@/components/pages/library/contextMenu/DownloadModal";
import IconButton from "@/components/ui/IconButton";
import EditTitleModal from "./EditTitleModal";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      height: "140px",
      display: "flex",
      padding: "0 16px",
      flexDirection: "row",
      alignItems: "center",
    },

    title: {
      display: "flex",
      alignItems: "center",
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
      marginLeft: "12px",
      textAlign: "left",
    },

    fileName: {
      flexGrow: 1,
    },

    iconEdit: {
      minWidth: "auto",
    },
  }),
);
type Props = {
  data: LibraryItemInterface;
  setData: React.Dispatch<React.SetStateAction<LibraryItemInterface>>;
  loading: boolean;
};

export default function FileHeader({ data, setData }: Props) {
  const classes = useStyles();
  const { t } = useTranslation("file");
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenDownloadModal = (opt: boolean) => {
    setOpenDownloadModal(opt);
  };

  return (
    <>
      <Box className="flex space-s-4 h-36 bg-primary-main items-center px-4">
        <div>
          <Avatar size={10} borderRadius="8px!important" />
        </div>
        <Grid container alignItems="baseline" direction="column">
          <Box className={classes.title}>
            <Text className={classes.fileName}>{data.title || t("addTitle")}</Text>
            <IconButton
              icon="edit"
              handleClick={() => setOpenModal(true)}
              className={classes.iconEdit}
              iconColor="#fff"
              fontSizeIcon={18}
            />
          </Box>
          <IconButton
            icon="download"
            fontSizeIcon="small"
            iconColor="#fff"
            handleClick={() => handleOpenDownloadModal(true)}
            style={{ minWidth: 25, marginLeft: "4px", marginTop: "8px" }}
          />
        </Grid>
      </Box>
      {data && (
        <>
          <DownloadModal
            key={`${data.basename}-download-modal`}
            open={openDownloadModal}
            handleOpen={() => handleOpenDownloadModal(false)}
            filename={data.filename}
            basename={data.basename}
            mime={data.mime}
            arrayBufferBlob={data.arrayBufferBlob}
          />
          <EditTitleModal
            open={openModal}
            closeModal={() => setOpenModal(false)}
            data={data}
            setData={setData}
          />
        </>
      )}
    </>
  );
}
