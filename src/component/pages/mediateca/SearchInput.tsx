import React from "react";
import IconButton from "component/ui/IconButton";

type Props = {
  label: string;
  handleClick?: () => void | undefined;
};

function SearchInput({ label, handleClick }: Props) {
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "80% 20%",
        padding: 5,
        width: "100%",
      }}
    >
      <input
        type="text"
        placeholder={label}
        style={{
          borderColor: "#d6d6d6",
          padding: 10,
          width: "100%",
          marginTop: 10,
          marginBottom: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderStyle: "solid",
        }}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton fontSizeIcon="1.8em" color="black" icon="search" handleClick={handleClick} />
      </div>
    </div>
  );
}

export default SearchInput;
