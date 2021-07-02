import React from "react";
import TextField from "@material-ui/core/TextField";
import { SelectVariantProps } from "types";
import { SelectVariantEnum } from "enums";

type Props = {
  label: string;
  multiline?: boolean;
  variant: SelectVariantProps;
  id: string | undefined;
  [x: string]: any;
};

function TxtFld({
  label,
  multiline = false,
  variant = SelectVariantEnum.FILLED,
  id = "asd",
  ...props
}: Props) {
  return (
    <TextField
      className="width-based-device"
      id={id}
      variant={variant}
      label={label}
      multiline={multiline}
      {...props}
    />
  );
}

export default TxtFld;
