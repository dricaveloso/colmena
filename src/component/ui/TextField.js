import React from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import AccountCircle from "@material-ui/icons/AccountCircle";

function TxtFld({ label }) {
  return (
    <FormControl className="width-based-device">
      <InputLabel htmlFor="input-with-icon-adornment">{label}</InputLabel>
      <Input
        id="input-with-icon-adornment"
        style={{ padding: 10 }}
        startAdornment={
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export default TxtFld;
