import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum } from "enums";
import MaterialIcon from "component/ui/MaterialIcon";

export const getStaticProps: GetStaticProps = async ({
  locale,
}: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["intro", "drawer", "common"])),
    },
  };
};

interface ItemInterface {
  icon: string;
  text: string;
  handleClick?: () => void | null;
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
      icon: "perm_data_setting_sharp",
      text: t("step1.description"),
    },
    {
      icon: "wifi_off_sharp",
      text: t("step2.description"),
    },
    {
      icon: "cloud_upload_sharp",
      text: t("step3.description"),
    },
    {
      icon: "supervised_user_circle_sharp",
      text: t("step4.description"),
    },
  ];
  const extraItems: ItemExtraInterface[] = [
    {
      icon: "supervised_user_circle",
      text: t("communityTitle"),
      fontSize: "3.5em",
    },
    {
      icon: "library_music",
      text: d("myFilesTitle"),
      handleClick: () => navigate("/my-library"),
      fontSize: fontSizeExtra,
    },
  ];

  return (
    <LayoutApp title={t("aboutTitle")} back={true}>
      <FlexBox>
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "auto auto",
            gridColumnGap: "50px",
          }}
        >
          {items.map(({ icon, text }: ItemInterface) => (
            <FlexBox
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
          {extraItems.map(
            ({ icon, text, handleClick, fontSize }: ItemExtraInterface) => (
              <FlexBox
                extraStyle={{ alignItems: "center" }}
                justifyContent={JustifyContentEnum.CENTER}
              >
                {!!handleClick ? (
                  <IconButton
                    fontSizeIcon={fontSize}
                    color={color}
                    icon={icon}
                    handleClick={handleClick}
                  />
                ) : (
                  <MaterialIcon icon={icon} style={{ color, fontSize }} />
                )}
                <p style={{ fontSize: "12px" }}>{text}</p>
              </FlexBox>
            )
          )}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default About;
