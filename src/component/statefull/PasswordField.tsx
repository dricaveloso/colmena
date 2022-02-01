/* eslint-disable @typescript-eslint/ban-types */
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
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  placeholder: string;
  label: string;
  name: string;
  required?: boolean;
  handleChangePassword: (value: string) => void;
  InputProps?: {};
  mainColor?: string;
};

function PasswordField({
  label,
  name,
  placeholder,
  handleChangePassword,
  required = false,
  mainColor = "#343A40",
}: Props) {
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const color = `${mainColor} !important`;

  const useOutlinedInputStyles = makeStyles(() => ({
    input: {
      color,
    },
    focused: {
      borderColor: color,
    },
    notchedOutline: {
      borderColor: color,
    },
  }));
  const outlinedInputClasses = useOutlinedInputStyles();

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
        classes={outlinedInputClasses}
        inputProps={{
          autoComplete: `new-${name}`,
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
              {values.showPassword ? (
                <Visibility style={{ color: mainColor }} />
              ) : (
                <VisibilityOff style={{ color: mainColor }} />
              )}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={70}
      />
    </FormControl>
  );
}

export default PasswordField;
