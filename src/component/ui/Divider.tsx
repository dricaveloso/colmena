import React from "react";

type Props = {
  marginTop?: number;
  marginBottom?: number;
};

function Divider({ marginTop = 40, marginBottom = 0 }: Props) {
  return <div style={{ marginTop, marginBottom }} />;
}

export default Divider;
