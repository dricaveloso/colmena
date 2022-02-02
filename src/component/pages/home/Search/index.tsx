/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";
import React from "react";

const Search = () => {
  const { t: c } = useTranslation("common");

  return (
    <div className="searchForm">
      <form className="nosubmit" data-testid="ui-search">
        <input
          className="nosubmit"
          type="search"
          onClick={() => toast(c("featureUnavailable"), "warning")}
        />
      </form>
    </div>
  );
};

export default Search;
