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
import { setCurrentPage } from "@/store/actions/config/index";
import { setCurrentAudioPlaying } from "@/store/actions/library/index";
import { updateRecordingState } from "@/store/actions/recordings/index";

interface LayoutInterface extends AppBarInterface {
  showFooter?: boolean;
  children: React.ReactNode;
}

function LayoutApp({
  title,
  subtitle = "",
  drawer = true,
  back = false,
  headerPosition = PositionEnum.FIXED,
  templateHeader = "variation2",
  showFooter = true,
  extraElement = undefined,
  children,
}: LayoutInterface) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(setCurrentAudioPlaying(""));
    dispatch(updateRecordingState("NONE"));
    if (router.asPath !== "/profile") dispatch(setCurrentPage(router.asPath));
    if (navigator.onLine) {
      (async () => {
        try {
          const session = await getSession();
          if (!session || !userRdx.user) {
            await signOut({ redirect: false });
            router.push("/login");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, []);

  return (
    <Container extraStyle={{ padding: 0, backgroundColor: "#F9F9F9" }}>
      <FlexBox extraStyle={{ margin: 0, padding: 0 }}>
        <AppBar
          title={title}
          subtitle={subtitle}
          headerPosition={headerPosition}
          drawer={drawer}
          templateHeader={templateHeader}
          back={back}
          extraElement={extraElement}
        />
        <>{children}</>
        {showFooter && <FooterApp />}
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
