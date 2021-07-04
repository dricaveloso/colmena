import React from "react";

type BoxItemShareProps = {
  title: string;
  children: React.ReactNode;
};

const BoxItemShare = ({ title, children }: BoxItemShareProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    }}
  >
    {children}
    <span style={{ marginLeft: 15 }}>{title}</span>
  </div>
);

export default BoxItemShare;
