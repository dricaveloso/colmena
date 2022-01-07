import React, { useState, useEffect, useCallback } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface, TagInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { createTag, deleteTag, listTags, updateTag } from "@/services/webdav/tags";
import { SystemTagsInterface } from "@/interfaces/tags";
import TagsListTable from "@/components/pages/tags/TagsListTable";
import ActionConfirm from "@/components/ui/ActionConfirm";
import Button from "@/components/ui/Button";
import SvgIcon from "@/components/ui/SvgIcon";
import FormModal from "@/components/pages/tags/FormModal";
import { toast } from "@/utils/notifications";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["tags"])),
  },
});

function Tags() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [tags, setTags] = useState<Array<TagInterface>>([]);
  const [rawTags, setRawTags] = useState<Array<TagInterface>>([]);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState<TagInterface | undefined>(undefined);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { t } = useTranslation("tags");

  useEffect(() => {
    setLoading(true);
    (async () => {
      const tagsList = await listAndPrepareTags();
      if (tagsList) {
        setRawTags(tagsList);
        setTags(tagsList);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTags(rawTags);
  }, [rawTags]);

  const listAndPrepareTags = async () => {
    const tagsList = await listTags();
    if (tagsList) {
      const newRows: Array<TagInterface> = [];

      tagsList
        .filter((_, idx) => idx !== 0)
        .forEach((item: any | SystemTagsInterface) => {
          const tagId = item.propstat.prop.id;
          newRows.push({
            id: tagId,
            tag: item.propstat.prop["display-name"],
          });
        });

      return newRows;
    }

    return [];
  };

  const deleteTagConfirm = (tag: TagInterface) => {
    setShowDeleteConfirmation(true);
    setTag(tag);
  };

  const handleDelete = useCallback(async () => {
    if (!tag) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteTag(tag.id);
    } catch (e) {
      switch (e.response.status) {
        case 403:
          setShowDeleteConfirmation(false);
          toast(t("messages.forbidden"), "error");
          break;
        default:
          toast(e.message, "error");
          break;
      }

      setDeleteLoading(false);

      return;
    }

    setRawTags(rawTags.filter((item) => item.id !== tag.id));
    setDeleteLoading(false);
    setTag(undefined);
    toast(t("messages.tagRemovedSuccessfully"), "success");
    setShowDeleteConfirmation(false);
  }, [rawTags, t, tag]);

  const editTagModal = (tag: TagInterface) => {
    setTag(tag);
    setShowFormModal(true);
  };

  const createTagModal = () => {
    setTag(undefined);
    setShowFormModal(true);
  };

  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        setFormLoading(true);
        if (tag) {
          await updateTag(tag.id, values.name);
          const newRawTags = rawTags.map((item) => {
            if (item.id === tag.id) {
              return { ...item, tag: values.name };
            }

            return item;
          });

          setRawTags(newRawTags);
          toast(t("messages.tagUpdatedSuccessfully"), "success");
        } else {
          await createTag(values.name);
          const tagsList = await listAndPrepareTags();
          if (tagsList) {
            setRawTags(tagsList);
          }

          toast(t("messages.tagCreatedSuccessfully"), "success");
        }
      } catch (e) {
        switch (e.response.status) {
          case 409:
            toast(t("messages.tagAlreadyExists"), "error");
            break;
          case 403:
            setShowFormModal(false);
            toast(t("messages.forbidden"), "error");
            break;
          default:
            toast(e.message, "error");
            break;
        }

        setFormLoading(false);

        return;
      }

      setFormLoading(false);
      setTag(undefined);
      setShowFormModal(false);
    },
    [rawTags, t, tag],
  );

  return (
    <>
      <LayoutApp
        title={t("title")}
        drawer={false}
        back
        extraElement={
          <Button
            title={<SvgIcon icon="plus" htmlColor="#fff" fontSize="small" />}
            handleClick={createTagModal}
          />
        }
      >
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ padding: 0, margin: 0 }}
        >
          <FlexBox
            justifyContent={JustifyContentEnum.FLEXSTART}
            extraStyle={{ paddingTop: 25, marginTop: 0 }}
          >
            <TagsListTable
              tags={tags}
              isLoading={loading}
              deleteTag={deleteTagConfirm}
              editTag={editTagModal}
            />
          </FlexBox>
        </FlexBox>
      </LayoutApp>
      {showDeleteConfirmation && (
        <ActionConfirm
          onOk={handleDelete}
          onClose={() => setShowDeleteConfirmation(false)}
          isLoading={deleteLoading}
        />
      )}
      {showFormModal && (
        <FormModal
          tag={tag}
          handleSubmit={handleSubmit}
          handleClose={() => setShowFormModal(false)}
          isLoading={formLoading}
        />
      )}
    </>
  );
}

export default Tags;
