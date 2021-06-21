import React from "react";
import TextField from "@material-ui/core/TextField";

function TxtFld({ label, multiline = false, variant = "filled", id = "asd" }) {
  return (
    <TextField
      className="width-based-device"
      id={id}
      variant={variant}
      label={label}
      multiline={multiline}
    />
  );
}

export default TxtFld;
