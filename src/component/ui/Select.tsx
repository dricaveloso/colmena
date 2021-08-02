import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { SelectVariantProps } from "@/types/index";
import { SelectVariantEnum } from "@/enums/index";

type Props = {
  id: string | undefined;
  label: string;
  variant: SelectVariantProps;
  handleChange?: () => void | undefined;
};

function Slt({ id, label, variant = SelectVariantEnum.OUTLINED, handleChange }: Props) {
  return (
    <FormControl variant={variant} style={{ width: "100%" }}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        variant={variant}
        placeholder={label}
        labelId={id}
        id={id}
        style={{ textAlign: "left", paddingLeft: 0 }}
        onChange={handleChange}
        label={label}
        fullWidth
      >
        <MenuItem value={20}>Colaborador</MenuItem>
        <MenuItem value={10}>Administrador</MenuItem>
      </Select>
    </FormControl>
  );
}

export default Slt;
