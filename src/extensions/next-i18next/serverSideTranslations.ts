import { SSRConfig, UserConfig } from "next-i18next";
import { serverSideTranslations as serverSideTranslationsBase } from "next-i18next/serverSideTranslations";

export default function serverSideTranslations(
  initialLocale: string,
  namespacesRequired?: string[] | undefined, configOverride?: UserConfig | null,
): Promise<SSRConfig> {
  let namespaces = ["drawer", "common"];
  if (namespacesRequired) {
    namespaces = [...namespaces, ...namespacesRequired];
  }

  return serverSideTranslationsBase(initialLocale, namespaces, configOverride);
}
