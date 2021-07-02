import React from "react";

type Props = {
  flexDirection?: "column" | "row";
  children: React.ReactNode;
};

function Box100({ flexDirection = "column", children }: Props) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection,
      }}
    >
      <>{children}</>
    </div>
  );
}

export default Box100;
