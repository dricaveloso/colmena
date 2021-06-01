import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
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
    // <TextField
    //   {...props}
    //   className="width-based-device"
    // InputProps={{
    //   startAdornment: (
    //     <InputAdornment position="start">
    //       <AccountCircle />
    //     </InputAdornment>
    //   ),
    // }}
    // />
  );
}

export default TxtFld;
