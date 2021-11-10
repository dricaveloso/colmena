import React from "react";
import Library from "./index";
import { GetStaticProps, GetStaticPaths } from "next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { I18nInterface } from "@/interfaces/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["library"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const MyLibrary = () => <Library />;

export default MyLibrary;
