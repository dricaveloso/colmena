/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
import React from "react";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import LayoutApp from "@/components/statefull/LayoutApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import usePwa from "use-pwa";
import BrowserDetected from "@/components/pages/install/BrowserDetected";
import BrowserCompabilities from "@/components/pages/install/BrowserCompabilities";
import ActionToInstallOrUpdate from "@/components/pages/install/ActionToInstallOrUpdate";
import Loading from "@/components/ui/Loading";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["install"])),
  },
});

function Install() {
  const { t } = useTranslation("install");
  const { appinstalled, canInstallprompt, enabledPwa, isLoading, showInstallPrompt } = usePwa();

  // const handleClick = useCallback(async () => {
  //   const result = await unregister();

  //   if (result) {
  //     toast(t("updateSuccesfull"), "success", { timer: 3000 });
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 3000);

  //     return;
  //   }
  //   toast(t("updateFailed"), "error");
  // }, [unregister]);

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox
        padding={0}
        justifyContent={JustifyContentEnum.FLEXSTART}
        alignItems={AlignItemsEnum.FLEXSTART}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
          width="100%"
          flexDirection="column"
          paddingTop={4}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <ActionToInstallOrUpdate
                appinstalled={appinstalled}
                canInstallprompt={canInstallprompt}
                enabledPwa={enabledPwa}
                showInstallPrompt={showInstallPrompt}
              />
              <BrowserDetected />
              {!enabledPwa && <BrowserCompabilities />}
            </>
          )}
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default Install;
