/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { getSession, signOut } from "next-auth/client";
import Container from "@/components/ui/Container";
import FlexBox from "@/components/ui/FlexBox";
import AppBar from "@/components/statefull/AppBar";
import FooterApp from "@/components/ui/FooterApp";
import { PositionProps, PropsUserSelector } from "@/types/index";
import { PositionEnum } from "@/enums/index";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

type Props = {
  title: string;
  drawer?: boolean;
  back?: boolean;
  headerPosition?: PositionProps | undefined;
  children: React.ReactNode;
};

function LayoutApp({
  title,
  drawer = true,
  back = false,
  headerPosition = PositionEnum.FIXED,
  children,
}: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  useEffect(() => {
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
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ margin: 0 }}>
        <AppBar title={title} headerPosition={headerPosition} drawer={drawer} back={back} />
        <>{children}</>
        <FooterApp />
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
