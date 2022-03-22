import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum, TextAlignEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { v4 as uuid } from "uuid";
import SvgIcon from "@/components/ui/SvgIcon";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["help"])),
  },
});

function Help() {
  const { t } = useTranslation("help");

  const items = [
    {
      support: t("items.item1"),
    },
    {
      support: t("items.item2"),
    },
    {
      support: t("items.item3"),
    },
    {
      support: t("items.item4"),
    },
    {
      support: t("items.item5"),
    },
  ];

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox
        padding={15}
        justifyContent={JustifyContentEnum.FLEXSTART}
        alignItems={AlignItemsEnum.FLEXSTART}
      >
        <Text variant={TextVariantEnum.BODY2} align={TextAlignEnum.LEFT}>
          {t("subtitle")}
        </Text>
        <List>
          {items.map((item) => (
            <ListItem key={uuid()}>
              <ListItemText
                primary={
                  <Box display="flex" flex={1} justifyContent="flex-start" alignItems="center">
                    <SvgIcon
                      icon="record"
                      style={{ fontSize: 10 }}
                      htmlColor={theme.palette.icon.dark}
                    />
                    <Text
                      variant={TextVariantEnum.BODY2}
                      style={{ margin: 5 }}
                      align={TextAlignEnum.LEFT}
                    >
                      {item.support}
                    </Text>
                  </Box>
                }
                primaryTypographyProps={{ style: { textAlign: "left" } }}
              />
            </ListItem>
          ))}
        </List>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default Help;
