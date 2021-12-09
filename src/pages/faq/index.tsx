import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import Text from "@/components/ui/Text";
import Box from "@material-ui/core/Box";
import Accordion from "@/components/ui/Accordion";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["faq"])),
  },
});

function Faq() {
  const { t } = useTranslation("faq");

  const faq = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1"),
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2"),
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3"),
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4"),
    },
    {
      question: t("faq.question5"),
      answer: t("faq.answer5"),
    },
    {
      question: t("faq.question6"),
      answer: t("faq.answer6"),
    },
    {
      question: t("faq.question7"),
      answer: t("faq.answer7"),
    },
    {
      question: t("faq.question8"),
      answer: t("faq.answer8"),
    },
    {
      question: t("faq.question9"),
      answer: t("faq.answer9"),
    },
    {
      question: t("faq.question10"),
      answer: t("faq.answer10"),
    },
    {
      question: t("faq.question11"),
      answer: t("faq.answer11"),
    },
    {
      question: t("faq.question12"),
      answer: t("faq.answer12"),
    },
  ];

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} padding={0}>
        <Box style={{ backgroundColor: "#fff" }} padding={2}>
          <Text
            variant={TextVariantEnum.BODY1}
            style={{ textAlign: "left", fontWeight: 600, marginBottom: 10 }}
          >
            {t("subtitle")}
          </Text>
          <Accordion data={faq} />
        </Box>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default Faq;
