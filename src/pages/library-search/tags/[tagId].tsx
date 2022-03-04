import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticPaths, GetStaticProps } from "next";
import { I18nInterface, LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Tags from "@/components/pages/library-search/Tags";
import SearchBar from "@/components/pages/library-search/SearchBar";
import ListItems from "@/components/pages/library-search/ListItems";
import { getAllPaths } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getAllTags } from "@/services/webdav/tags";
import { toast } from "@/utils/notifications";
import { TagInterface } from "@/interfaces/tags";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["library", "librarySearch"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default function LibrarySearchTags() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { tagId } = router.query;
  const [rawItems, setRawItems] = useState<LibraryItemInterface[]>([]);
  const [items, setItems] = useState<LibraryItemInterface[]>([]);
  const [rawTags, setRawTags] = useState<TagInterface[]>([]);
  const [tag, setTag] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation("librarySearch");
  const { t: c } = useTranslation("common");
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });

  const handleOpenTag = (tag: any) => {
    router.replace(
      {
        pathname: `/library-search/tags/${tag.tagId}`,
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const search = (tag: string) => {
    setItems(filterByTag(rawItems, tag));
  };

  const getTags = (tagId?: string) => rawTags.filter((rawTag) => rawTag.tagId === tagId);

  const filterByTag = (items: LibraryItemInterface[], tagId?: string) => {
    const tags = getTags(tagId);
    if (!tags || tags.length === 0) {
      toast(t("messages.tagNotFound"), "error");
      router.replace("/library-search");
    }

    return items.filter(
      (item: LibraryItemInterface) =>
        tags &&
        tags.filter((tag) => tag.fileName.replace(/(.+?files\/|^files\/)/, "") === item.filename)
          .length > 0,
    );
  };

  const loadRawItems = async () => {
    const items = await getAllPaths(userRdx.user.id, timeDescription);
    setRawItems(items);
  };

  const loadRawTags = async () => {
    const tags = await getAllTags();
    setRawTags(tags);
  };

  const reloadItems = async () => {
    setIsLoading(true);
    await loadRawItems();
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([loadRawTags(), loadRawItems()]).then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof tagId === "string" && rawItems.length > 0 && rawTags.length > 0) {
      setTag(tagId);
      search(tagId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawTags, rawItems, tagId]);

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <Tags rawItems={rawItems} rawTags={rawTags} currentTag={tag} openTag={handleOpenTag} />
        <SearchBar totalItems={items ? items.length : 0} />
        <ListItems items={items} loading={isLoading} reloadItems={reloadItems} />
      </FlexBox>
    </LayoutApp>
  );
}
