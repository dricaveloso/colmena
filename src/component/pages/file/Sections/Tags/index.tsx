import React, { useState, useEffect, useCallback } from "react";
import Chip from "@material-ui/core/Chip";
import { v4 as uuid } from "uuid";
import IconButton from "@/components/ui/IconButton";
import Section from "@/components/pages/file/Section";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTranslation } from "next-i18next";
import Box from "@material-ui/core/Box";
import { getFileTags, ItemTagInterface, unlinkTagFile } from "@/services/webdav/tags";
import { LibraryItemInterface } from "@/interfaces/index";
import { PropsUserSelector } from "@/types/*";
import { useSelector } from "react-redux";
import CreateTagModal from "./CreateTagModal";

type Props = {
  data: LibraryItemInterface;
};

export default function TagsSection({ data }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { t } = useTranslation("file");
  const [tags, setTags] = useState<Array<ItemTagInterface>>([]);
  const [loading, setLoading] = useState(false);

  const getTags = useCallback(async () => {
    if (data.fileId) {
      setLoading(true);
      const ncTags = await getFileTags(userRdx.user.id, data.filename, data.fileId);
      if (ncTags) {
        setTags(ncTags);
        setLoading(false);
      }
    }
  }, [data.fileId, data.filename, userRdx.user.id]);

  const unlinkTag = useCallback(
    async (tagId: number) => {
      if (data.fileId) {
        setTags(tags.filter((tag) => Number(tag.id) !== tagId));
        unlinkTagFile(data.fileId, tagId);
      }
    },
    [data.fileId, tags],
  );

  useEffect(() => {
    getTags();
  }, [getTags]);

  return (
    <>
      <Section
        title={t("tagTitle")}
        secondaryAction={
          <IconButton
            icon="plus"
            fontSizeIcon="small"
            handleClick={() => setOpenModal(true)}
            style={{ minWidth: 25 }}
          />
        }
      >
        {loading ? (
          <Box display="flex" flex={1} flexDirection="row" justifyContent="flex-start">
            <Skeleton style={{ marginRight: 10 }} width={80} height={30} />
            <Skeleton style={{ marginRight: 10 }} width={50} height={30} />
            <Skeleton style={{ marginRight: 10 }} width={90} height={30} />
            <Skeleton style={{ marginRight: 10 }} width={70} height={30} />
          </Box>
        ) : (
          Array.isArray(tags) &&
          tags.length > 0 &&
          tags.map((item: any | ItemTagInterface) => (
            <Chip
              key={uuid()}
              label={
                <Box component="span" display="flex" flexDirection="row">
                  {item["display-name"].toLowerCase()}
                  <IconButton
                    style={{ padding: "0 0 0 4px", minWidth: "auto" }}
                    variant="text"
                    size="small"
                    icon="delete"
                    fontSizeIcon={12}
                    handleClick={() => unlinkTag(Number(item.id))}
                  />
                </Box>
              }
              style={{ marginRight: 5 }}
            />
          ))
        )}
      </Section>
      <CreateTagModal
        data={data}
        open={openModal}
        closeModal={() => setOpenModal(false)}
        setTags={setTags}
      />
    </>
  );
}
