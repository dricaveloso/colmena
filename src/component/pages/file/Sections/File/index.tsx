import React from "react";
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import Section from "@/components/pages/file/Section";
import { useTranslation } from "next-i18next";
import Library from "@/components/pages/library";
import { ContextMenuEventEnum, ContextMenuOptionEnum, ListTypeEnum } from "@/enums/*";
import ContextMenuOptions from "@/components/pages/library/contextMenu";
import { LibraryItemInterface } from "@/interfaces/index";
import { useRouter } from "next/router";
import { getPath } from "@/utils/directory";

type Props = {
  data: LibraryItemInterface;
  setData: React.Dispatch<React.SetStateAction<LibraryItemInterface>>;
  loading: boolean;
};

export default function FileSection({ data, setData, loading }: Props) {
  const { basename } = data;
  const { t } = useTranslation("file");
  const router = useRouter();

  const redirectToLibrary = (aliasFilename: string) =>
    router.push(`/library/${getPath(aliasFilename)}`);

  const redirectToFile = (filename: string) => {
    router.push(`/file/${btoa(filename)}`, undefined, { shallow: true });
  };

  const handleContextMenuUpdate = async (
    item: LibraryItemInterface,
    event: ContextMenuEventEnum,
    option: ContextMenuOptionEnum,
  ) => {
    switch (event) {
      case ContextMenuEventEnum.UPDATE:
        setData(item);

        if (option === ContextMenuOptionEnum.RENAME) {
          redirectToFile(item.filename);
        }
        break;
      case ContextMenuEventEnum.CREATE:
        if (option === ContextMenuOptionEnum.MOVE) {
          redirectToFile(item.filename);
        }
        break;
      case ContextMenuEventEnum.DELETE:
        redirectToLibrary(item.aliasFilename);
        break;
      default:
        break;
    }
  };

  return (
    <Section
      title={t("fileTitle")}
      secondaryAction={
        <ContextMenuOptions
          key={`${basename}-more-options`}
          {...data}
          availableOptions={[
            ContextMenuOptionEnum.EDIT,
            ContextMenuOptionEnum.COPY,
            ContextMenuOptionEnum.MOVE,
            ContextMenuOptionEnum.AVAILABLE_OFFLINE,
            ContextMenuOptionEnum.DOWNLOAD,
            ContextMenuOptionEnum.DELETE,
            ContextMenuOptionEnum.DUPLICATE,
            ContextMenuOptionEnum.PUBLISH,
            ContextMenuOptionEnum.RENAME,
          ]}
          onChange={handleContextMenuUpdate}
        />
      }
    >
      <Library
        items={[data]}
        listType={ListTypeEnum.LIST}
        isLoading={loading}
        itemsQuantitySkeleton={1}
      />
    </Section>
  );
}
