import React from "react";
import { BadgeVariantEnum } from "@/enums/*";

type Props = {
  description?: string;
  bgColor?: string;
  textColor?: string;
  padding?: string | number;
  variant?: BadgeVariantEnum;
  display?: string;
  borderRadius?: string;
};

const defaultData = {
  textColor: "#424242",
  bgColor: "#eaeaea",
};

const getVariant = (variant: BadgeVariantEnum) => {
  let { textColor } = defaultData;
  let { bgColor } = defaultData;

  switch (variant) {
    case BadgeVariantEnum.SUCCESS:
      textColor = "#2A6021";
      bgColor = "#B5FFA2";
      break;
    case BadgeVariantEnum.ERROR:
      textColor = "#931600";
      bgColor = "#FF9D9D";
      break;
    case BadgeVariantEnum.INFO:
      textColor = "#193549";
      bgColor = "#A3EDFD";
      break;
    case BadgeVariantEnum.WARNING:
      textColor = "#931600";
      bgColor = "#FF9D9D";
      break;

    default:
      break;
  }

  return {
    textColor,
    bgColor,
  };
};

export default function Badge({
  description,
  bgColor,
  textColor,
  padding = "2px 4px",
  variant,
  display = "inline-block",
  borderRadius = "5px",
}: Props) {
  let background = defaultData.bgColor;
  let color = defaultData.textColor;

  if (variant) {
    const variantData = getVariant(variant);
    background = variantData.bgColor;
    color = variantData.textColor;
  }

  if (bgColor) {
    background = bgColor;
  }

  if (textColor) {
    color = textColor;
  }

  return <span style={{ background, color, padding, display, borderRadius }}>{description}</span>;
}
