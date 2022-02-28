import { TextVariantEnum } from "@/enums/*";
import React from "react";
import { Box } from "@material-ui/core";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Text from "@/components/ui/Text";
import { v4 as uuid } from "uuid";

const CardItemSubtitle = ({ sizeFormatted }: LibraryCardItemInterface) => {
  const description: Array<any> = [];
  description.push(
    <Text
      key={`sizeFormatted-${uuid()}`}
      variant={TextVariantEnum.CAPTION}
      style={{ color: "#757575" }}
    >
      {sizeFormatted}
    </Text>,
  );

  return (
    <>
      {description && (
        <Box component="span" display="flex" alignItems="center">
          {description.map((item) => (
            <Box key={uuid()} component="span" pr={1}>
              {item}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default CardItemSubtitle;
