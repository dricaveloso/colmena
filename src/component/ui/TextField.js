import React from "react";
import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import AccountCircle from "@material-ui/icons/AccountCircle";

function TxtFld(props) {
  return (
    <TextField
      {...props}
      className="blocked-button"
      // InputProps={{
      //   startAdornment: (
      //     <InputAdornment position="start">
      //       <AccountCircle />
      //     </InputAdornment>
      //   ),
      // }}
    />
  );
}

export default TxtFld;
