/* eslint-disable react/button-has-type */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { getSession, signOut } from "next-auth/client";
import Container from "@/components/ui/Container";
import FlexBox from "@/components/ui/FlexBox";
import AppBar, { AppBarInterface } from "@/components/statefull/AppBar";
import FooterApp from "@/components/ui/FooterApp";
import { PropsUserSelector } from "@/types/index";
import { PositionEnum } from "@/enums/index";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentAudioPlaying } from "@/store/actions/library/index";
import { updateRecordingState } from "@/store/actions/recordings/index";
import { getAccessedPages, setAccessedPages } from "@/utils/utils";

interface LayoutInterface extends AppBarInterface {
  showFooter?: boolean;
  backgroundColor?: string;
  children: React.ReactNode;
}

function LayoutApp({
  title,
  fontSizeTitle = 20,
  subtitle = "",
  fontSizeSubtitle = 15,
  drawer = true,
  back = false,
  headerPosition = PositionEnum.FIXED,
  templateHeader = "variation2",
  showFooter = true,
  extraElement = undefined,
  leftExtraElement = undefined,
  backgroundColor = "#F9F9F9",
  showUploadProgress = true,
  children,
}: LayoutInterface) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const updateAccessedPages = async () => {
    const pages = await getAccessedPages();
    if (pages.length > 0) {
      pages.unshift(router.asPath);
      const pagesAcR = [...new Set(pages)];
      await setAccessedPages(pagesAcR);
    } else {
      await setAccessedPages([router.asPath]);
    }
  };

  useEffect(() => {
    dispatch(setCurrentAudioPlaying(""));
    dispatch(updateRecordingState("NONE"));
    updateAccessedPages();
    if (navigator.onLine) {
      (async () => {
        try {
          const session = await getSession();
          if (!session || !userRdx.user) {
            await signOut({ redirect: false });
            router.push("/login?out");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, []);

  return (
    <Container extraStyle={{ padding: 0, backgroundColor }}>
      <FlexBox extraStyle={{ margin: 0, padding: 0 }}>
        <AppBar
          title={title}
          fontSizeTitle={fontSizeTitle}
          subtitle={subtitle}
          fontSizeSubtitle={fontSizeSubtitle}
          headerPosition={headerPosition}
          drawer={drawer}
          templateHeader={templateHeader}
          back={back}
          extraElement={extraElement}
          leftExtraElement={leftExtraElement}
          showUploadProgress={showUploadProgress}
        />
        <>{children}</>
        {showFooter && <FooterApp />}
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
