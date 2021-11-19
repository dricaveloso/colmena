import React from "react";
import TextField from "@material-ui/core/TextField";
import { SelectVariantProps } from "@/types/index";
import { SelectVariantEnum } from "@/enums/index";
import { v4 as uuid } from "uuid";

type Props = {
  label: string;
  multiline?: boolean;
  variant: SelectVariantProps;
  size?: "medium" | "small";
  id?: string | undefined;
  [x: string]: any;
};

function TxtFld({
  label,
  multiline = false,
  variant = SelectVariantEnum.FILLED,
  size = "medium",
  id = uuid(),
  ...props
}: Props) {
  return (
    <TextField
      className="width-based-device"
      id={id}
      size={size}
      variant={variant}
      label={label}
      multiline={multiline}
      {...props}
    />
  );
}

export default TxtFld;
