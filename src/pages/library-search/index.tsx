import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface, LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import SearchInput from "@/components/pages/library-search/SearchInput";
import Tags from "@/components/pages/library-search/Tags";
// import Recents from "@/components/pages/library-search/Recents";
import SearchBar from "@/components/pages/library-search/SearchBar";
import ListItems from "@/components/pages/library-search/ListItems";
import { searchItems, getAllPaths } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getAllTags } from "@/services/webdav/tags";
import { TagInterface } from "@/interfaces/tags";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["library", "librarySearch"])),
  },
});

function LibrarySearch() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { keyword: urlKeyword } = router.query;
  const [rawItems, setRawItems] = useState<LibraryItemInterface[]>([]);
  const [rawTags, setRawTags] = useState<TagInterface[]>();
  const [items, setItems] = useState<LibraryItemInterface[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [tag, setTag] = useState<number>();
  const [lastUrlKeyword, setLastUrlKeyword] = useState<undefined | string>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation("librarySearch");
  const { t: c } = useTranslation("common");
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });

  const handleOpenTag = (tag: TagInterface) => {
    router.push(`/library-search/tags/${tag.tagId}`);
  };

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setKeyword("");
      setIsSearching(false);
      setItems([]);
    }

    // search(keyword);
    router.push(
      {
        pathname: "/library-search",
        query: keyword ? { keyword } : undefined,
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const search = (keyword: string) => {
    const searching = keyword.length > 0;
    setIsSearching(searching);
    setKeyword(keyword ?? "");
    setTag(tag);
    if (!searching) {
      return;
    }

    const items = searchItems(rawItems, userRdx.user.id, keyword);

    setItems(items);
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
    Promise.all([loadRawItems(), loadRawTags()]).then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof urlKeyword === "string" && rawItems.length > 0) {
      setLastUrlKeyword(urlKeyword);
      search(decodeURIComponent(urlKeyword));
    } else if (lastUrlKeyword && rawItems.length > 0) {
      search("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKeyword, rawItems]);

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <SearchInput keyword={keyword} search={handleSearch} />

        {(isSearching && (
          <>
            <SearchBar totalItems={items ? items.length : 0} />
            <ListItems items={items} loading={isLoading} reloadItems={reloadItems} />
          </>
        )) || (
          <>
            <Tags rawItems={rawItems} rawTags={rawTags} openTag={handleOpenTag} />
            {/* <Recents /> */}
          </>
        )}
      </FlexBox>
    </LayoutApp>
  );
}

export default LibrarySearch;
