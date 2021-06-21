import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

function Slt({ id, label, variant = "outlined", handleChange = () => {} }) {
  return (
    <FormControl variant="filled" style={{ width: "100%" }}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        variant={variant}
        placeholder={label}
        className="width-based-device"
        labelId={id}
        id={id}
        // value={age}
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Restrito</MenuItem>
        <MenuItem value={20}>Público</MenuItem>
      </Select>
    </FormControl>
  );
}

export default Slt;