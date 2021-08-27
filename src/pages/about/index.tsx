import FlexBox from "@/components/ui/FlexBox";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "@/components/statefull/LayoutApp";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { FlexDirectionEnum, JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Text from "@/components/ui/Text";
import { v4 as uuid } from "uuid";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";

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

function About() {
  const router = useRouter();
  const fontSize = "4.0em";
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
          <FlexBox
            key={uuid()}
            justifyContent={JustifyContentEnum.SPACEBETWEEN}
            flexDirection={FlexDirectionEnum.ROW}
          >
            <div key={uuid()}>
              <MaterialIcon icon="supervised_user_circle" style={{ color, fontSize: "2.8em" }} />
              <Text variant={TextVariantEnum.BODY1}>{t("communityTitle")}</Text>
            </div>
          </FlexBox>
          <FlexBox
            key={uuid()}
            justifyContent={JustifyContentEnum.SPACEBETWEEN}
            flexDirection={FlexDirectionEnum.ROW}
          >
            <div key={uuid()}>
              <IconButton
                icon="library"
                handleClick={() => navigate("/library")}
                iconStyle={{ fontSize: "2.8em" }}
              />
              <Text variant={TextVariantEnum.BODY1}>{d("myFilesTitle")}</Text>
            </div>
          </FlexBox>
        </div>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default About;
