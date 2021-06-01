import React from "react";

function Box100({ flexDirection = "column", children }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection,
      }}
    >
      {children}
    </div>
  );
}

export default Box100;
