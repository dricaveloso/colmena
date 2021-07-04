import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum, TextVariantEnum } from "enums";
import MaterialIcon from "component/ui/MaterialIcon";
import Text from "component/ui/Text";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["intro", "drawer", "common"])),
  },
});

interface ItemInterface {
  id: number;
  icon: string;
  text: string;
  handleClick?: () => void | undefined;
}

interface ItemExtraInterface extends ItemInterface {
  fontSize: string;
}

function About() {
  const router = useRouter();
  const fontSize = "4.0em";
  const fontSizeExtra = "1.9em";
  const color = "black";
  const { t } = useTranslation("intro");
  const { t: d } = useTranslation("drawer");

  const navigate = (url: string) => {
    router.push(url);
  };

  const items: ItemInterface[] = [
    {
      id: 1,
      icon: "perm_data_setting_sharp",
      text: t("step1.description"),
    },
    {
      id: 2,
      icon: "wifi_off_sharp",
      text: t("step2.description"),
    },
    {
      id: 3,
      icon: "cloud_upload_sharp",
      text: t("step3.description"),
    },
    {
      id: 4,
      icon: "supervised_user_circle_sharp",
      text: t("step4.description"),
    },
  ];
  const extraItems: ItemExtraInterface[] = [
    {
      id: 5,
      icon: "supervised_user_circle",
      text: t("communityTitle"),
      fontSize: "3.5em",
    },
    {
      id: 6,
      icon: "library_music",
      text: d("myFilesTitle"),
      handleClick: () => navigate("/my-library"),
      fontSize: fontSizeExtra,
    },
  ];

  return (
    <LayoutApp title={t("aboutTitle")} back>
      <FlexBox>
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "auto auto",
            gridColumnGap: "50px",
          }}
        >
          {items.map(({ id, icon, text }: ItemInterface) => (
            <FlexBox
              key={id}
              justifyContent={JustifyContentEnum.FLEXSTART}
              extraStyle={{
                alignItems: "center",
              }}
            >
              <MaterialIcon icon={icon} style={{ fontSize, color }} />

              <p
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignSelf: "",
                }}
              >
                {text}
              </p>
            </FlexBox>
          ))}
        </div>
        <Divider />
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "auto auto",
            gridColumnGap: "50px",
          }}
        >
          {extraItems.map(({ id, icon, text, handleClick, fontSize }: ItemExtraInterface) => (
            <FlexBox
              key={id}
              extraStyle={{ alignItems: "center" }}
              justifyContent={JustifyContentEnum.CENTER}
            >
              {handleClick ? (
                <IconButton
                  fontSizeIcon={fontSize}
                  color={color}
                  icon={icon}
                  handleClick={handleClick}
                />
              ) : (
                <MaterialIcon icon={icon} style={{ color, fontSize }} />
              )}
              <Text variant={TextVariantEnum.BODY1}>{text}</Text>
            </FlexBox>
          ))}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default About;
