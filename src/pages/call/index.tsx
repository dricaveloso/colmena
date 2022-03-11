/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import RecordUsers from "@/components/pages/call/RecordUsers";
import ShareLinkComponent from "@/components/pages/call/ShareLink";
import Timer from "@/components/pages/call/Timer";
// import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import GoLive from "@/components/pages/call/GoLive";
import dynamic from "next/dynamic";
// @ts-ignore
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
// @ts-ignore
const WebRTCClient = dynamic(() => import("iotcomms-react-webrtc"), { ssr: false });
export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["call", "recording"])),
  },
});

function Call() {
  // const router = useRouter();
  const { t } = useTranslation("call");

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND} alignItems={AlignItemsEnum.CENTER}>
        <GoLive />
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer />
        <div className="App">
          <video width="25%" id="localVideo" autoPlay playsInline muted></video>

          <video width="50%" id="remoteVideo" autoPlay playsInline></video>

          <WebRTCClient
            // @ts-ignore
            video={true}
            autoRegister
            autoConnect={false}
            sipDomain=""
            sipServer=""
            sipUser=""
            destination=""
            metaData={{}}
            alertVideoUrl="alertUrl"
            ringbackVideoUrl="ringbackUrl"
            hideConnectionStatus={false}
            hideControls={false}
            autoAnswer={false}
            hangupCallNow={false}
            traceSip={false}
            callLabel="Custom call label"
            remoteVideo="remoteVideoElementId"
            localVideo="localVideoElementId"
            onConnected={() => {}}
            onConnecting={() => {}}
            onDisconnected={() => {}}
            onHangup={() => {}}
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Call;
