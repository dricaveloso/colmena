import React from "react";
import { Typography } from "@material-ui/core";
import {
  TextAlignProps,
  TextColorProps,
  TextDisplayProps,
  TextVariantProps,
  TextVariantMappingProps,
} from "types";
import {
  TextAlignEnum,
  TextColorEnum,
  TextDisplayEnum,
  TextVariantEnum,
} from "enums";
import { getStaticProps } from "pages/invitation";
import { POINT_CONVERSION_UNCOMPRESSED } from "constants";

type Props = {
  align?: TextAlignProps;
  color?: TextColorProps;
  display?: TextDisplayProps;
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  variant?: TextVariantProps;
  variantMapping?: TextVariantMappingProps;
  style?: object;
  children: React.ReactNode;
  [x: string]: any;
};

function Text({
  align = TextAlignEnum.INHERIT,
  color = TextColorEnum.INITIAL,
  display = TextDisplayEnum.INITIAL,
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
  variant = TextVariantEnum.BODY1,
  variantMapping = {
    h1: TextVariantEnum.H1,
    h2: TextVariantEnum.H2,
    h3: TextVariantEnum.H3,
    h4: TextVariantEnum.H4,
    h5: TextVariantEnum.H5,
    h6: TextVariantEnum.H6,
    subtitle1: TextVariantEnum.H6,
    subtitle2: TextVariantEnum.H6,
    body1: TextVariantEnum.P,
    body2: TextVariantEnum.P,
  },
  style = {},
  children,
  ...props
}: Props) {
  return (
    <Typography
      variant={variant}
      paragraph={paragraph}
      noWrap={noWrap}
      align={align}
      color={color}
      display={display}
      gutterBottom={gutterBottom}
      variantMapping={variantMapping}
      style={{ ...style }}
      {...props}
    >
      {children}
    </Typography>
  );
}

export default Text;
