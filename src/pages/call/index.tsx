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
// import dynamic from "next/dynamic";
// @ts-ignore
import SimpleWebRTC from "simplewebrtc";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["call", "recording"])),
  },
});

function Call() {
  // const router = useRouter();
  const { t } = useTranslation("call");
  const webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: "localVideo",
    // the id/element dom element that will hold remote videos
    remoteVideosEl: "remoteVideos",
    media: {
      video: true,
      audio: true,
    },
    // immediately ask for camera access
    autoRequestMedia: true,
  });
  webrtc.on("readyToCall", () => {
    // you can name it anything
    webrtc.joinRoom("your awesome room name");
  });

  webrtc.startLocalVideo();

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND} alignItems={AlignItemsEnum.CENTER}>
        <GoLive />
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer />
        <>
          <video id="localVideo" height={150}></video>
          <div id="remoteVideos"></div>
        </>
      </FlexBox>
    </LayoutApp>
  );
}

export default Call;
