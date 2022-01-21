import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { v4 as uuid } from "uuid";
import { SelectVariantProps, SelectOptionItem } from "@/types/index";
import { SelectVariantEnum, AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import Image from "next/image";
import FlexBox from "@/components/ui/FlexBox";

type Props = {
  id: string | undefined;
  label: string;
  name: string;
  variant: SelectVariantProps;
  options: SelectOptionItem[];
  handleChange?: () => void | undefined;
};

function Slt({
  id,
  label,
  name,
  variant = SelectVariantEnum.OUTLINED,
  options,
  handleChange,
  ...props
}: Props) {
  if (options.length === 0)
    return (
      <FlexBox justifyContent={JustifyContentEnum.CENTER} alignItems={AlignItemsEnum.CENTER}>
        <Image src="/images/loader.gif" width={40} height={40} />
      </FlexBox>
    );

  return (
    <FormControl variant={variant} style={{ width: "100%" }}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        variant={variant}
        placeholder={label}
        labelId={id}
        name={name}
        id={id}
        style={{ textAlign: "left", paddingLeft: 0 }}
        onChange={handleChange}
        label={label}
        {...props}
        fullWidth
      >
        {options.map((item) => (
          <MenuItem key={uuid()} value={item.id} disabled={item.disabled ? item.disabled : false}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Slt;
