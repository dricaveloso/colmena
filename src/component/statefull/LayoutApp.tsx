import React, { useEffect } from "react";
import { getSession } from "next-auth/client";
import Container from "@/components/ui/Container";
import FlexBox from "@/components/ui/FlexBox";
import AppBar from "@/components/statefull/AppBar";
import FooterApp from "@/components/ui/FooterApp";
import { PositionProps } from "@/types/index";
import { PositionEnum } from "@/enums/index";
import { useRouter } from "next/router";

type Props = {
  title: string;
  drawer?: boolean;
  headerPosition?: PositionProps | undefined;
  children: React.ReactNode;
};

function LayoutApp({ title, drawer = true, headerPosition = PositionEnum.FIXED, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session?.error === "RefreshAccessTokenError" || !session) router.push("/login");
    });
  }, [router]);

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ margin: 0 }}>
        <AppBar title={title} headerPosition={headerPosition} drawer={drawer} />
        <>{children}</>
        <FooterApp />
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
