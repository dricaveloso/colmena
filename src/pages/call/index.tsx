/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/button-has-type */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect } from "react";
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
// @ts-ignore
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["call", "recording"])),
  },
});

function Call() {
  // const router = useRouter();

  const { t } = useTranslation("call");

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer("a");
      const conn = peer.connect("another-peers-id");
      conn.on("open", () => {
        conn.send("hi!");
        console.log("hiii");
      });
      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          // Will print 'hi!'
          console.log(data);
        });
        conn.on("open", () => {
          conn.send("hello!");
        });
      });
      const getUserMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          const call = peer.call("a", stream);
          call.on("stream", (remoteStream) => {
            // Show stream in some video/canvas element.
            const video = document.querySelector("localVideo");
            console.log(video);
            const videoTracks = remoteStream.getVideoTracks();
            console.log(`Using video device: ${videoTracks[0].label}`);
            window.stream = remoteStream; // make variable available to browser console
            video.srcObject = remoteStream;
          });
        },
        (err) => {
          console.log("Failed to get local stream", err);
        },
      );
    });
  }, []);

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      handleSuccess(stream);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSuccess(stream) {
    const video = document.querySelector("video");
    const videoTracks = stream.getVideoTracks();
    console.log("Got stream with constraints:");
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
  }

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND} alignItems={AlignItemsEnum.CENTER}>
        <GoLive />
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer />
        <video id="localVideo" autoPlay playsInline></video>
        <button onClick={() => init()} type="button">
          show Video Streaming
        </button>
      </FlexBox>
    </LayoutApp>
  );
}

export default Call;
