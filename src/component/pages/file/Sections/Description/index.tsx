import React, { useState, useMemo } from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import Section from "@/components/pages/file/Section";
import Skeleton from "@material-ui/lab/Skeleton";
import IconButton from "@/components/ui/IconButton";
import EditDescriptionModal from "./EditDescriptionModal";
import Box from "@material-ui/core/Box";
import ListItemText from "@material-ui/core/ListItemText";
import { useTranslation } from "next-i18next";

type Props = {
  data: LibraryItemInterface;
  setData: React.Dispatch<React.SetStateAction<LibraryItemInterface>>;
  loading: boolean;
};

export default function DescriptionSection({ data, setData, loading }: Props) {
  const { t } = useTranslation("file");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const showDescriptionField = () => {
    setOpenModal(!openModal);
  };

  const description = useMemo(() => {
    if (data.description) {
      return <ListItemText id="description-item" primary={data.description} />;
    }

    return (
      <ListItemText
        id="description-item"
        primaryTypographyProps={{ style: { color: "gray" } }}
        primary={t("addFileDescription")}
      />
    );
  }, [data.description, t]);

  return (
    <>
      <Section
        title={t("descriptionTitle")}
        secondaryAction={
          <IconButton
            icon="edit"
            fontSizeIcon="small"
            handleClick={() => showDescriptionField()}
            style={{ minWidth: 25 }}
          />
        }
      >
        {loading && (
          <Box display="flex" flex={1} flexDirection="column" justifyContent="space-between">
            <Skeleton width="100%" />
            <Skeleton width="70%" />
            <Skeleton width="80%" />
          </Box>
        )}
        {description}
      </Section>
      <EditDescriptionModal
        open={openModal}
        closeModal={() => setOpenModal(false)}
        data={data}
        setData={setData}
      />
    </>
  );
}
