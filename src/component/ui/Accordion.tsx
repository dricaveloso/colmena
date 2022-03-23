import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  // heading: {
  //   fontSize: theme.typography.pxToRem(15),
  //   fontWeight: theme.typography.fontWeightRegular,
  // },
}));

type Props = {
  data: {
    question: string;
    answer: string | React.ReactNode;
  }[];
};

export default function SimpleAccordion({ data }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {data.map((item) => (
        <Accordion key={uuid()}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Text variant={TextVariantEnum.BODY1} style={{ textAlign: "start" }}>
              {item.question}
            </Text>
          </AccordionSummary>
          <AccordionDetails>
            <Text variant={TextVariantEnum.BODY2} style={{ textAlign: "start" }}>
              {item.answer}
            </Text>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
