import React, { useEffect } from "react";
import { getSession, signOut } from "next-auth/client";
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
    if (navigator.onLine) {
      (async () => {
        try {
          const session = await getSession();
          if (!session) {
            await signOut({ redirect: false });
            router.push("/login");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
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
