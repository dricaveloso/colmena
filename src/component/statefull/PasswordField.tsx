import React, { useState } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";

type Props = {
  placeholder: string;
  label: string;
  name: string;
  required?: boolean;
  handleChangePassword: (value: string) => void;
};

function PasswordField({
  label,
  name,
  placeholder,
  handleChangePassword,
  required = false,
}: Props) {
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: string) => (event: any) => {
    handleChangePassword(event.target.value);
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl style={{ width: "100%" }} variant="outlined">
      <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        type={values.showPassword ? "text" : "password"}
        value={values.password}
        onChange={handleChange("password")}
        fullWidth
        inputProps={{
          autoComplete: `new-${name}`,
          form: {
            autoComplete: "off",
          },
        }}
        required={required}
        label={label}
        placeholder={placeholder}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={70}
      />
    </FormControl>
  );
}

export default PasswordField;
