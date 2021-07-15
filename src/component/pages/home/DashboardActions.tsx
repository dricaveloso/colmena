import React, { useContext } from "react";
import { Fade, Box } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import MediaAvatar from "@/components/pages/home/MediaAvatar";
import GreetingMessage from "@/components/pages/home/GreetingMessage";
import TabPrimaryCategoryHomeList from "@/components/pages/home/TabPrimaryCategoryHomeList";
import Divider from "@/components/ui/Divider";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import UserContext from "@/store/user-context";

type Props = {
  showContent: boolean;
  isFirstAccess: boolean;
};

function DashboardActions({ showContent, isFirstAccess }: Props) {
  const { t: c } = useTranslation("common");
  const userCtx = useContext(UserContext);

  function getContent() {
    return (
      <Box padding={0} margin={0} style={{ width: "100%" }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Text variant={TextVariantEnum.BODY1} style={{ fontWeight: "bold", marginBottom: 10 }}>
            {c("welcomeUserMessage", { userName: userCtx.userInfo?.name })}
          </Text>
          <MediaAvatar size={12} />
          <GreetingMessage />
        </Box>
        <Divider marginTop={15} />
        <TabPrimaryCategoryHomeList />
      </Box>
    );
  }

  if (isFirstAccess)
    return (
      <Fade in={showContent} timeout={500}>
        {getContent()}
      </Fade>
    );

  return getContent();
}

export default DashboardActions;
