import React from "react";
import Image from "next/image";

export default function FooterDW() {
  return (
    <div style={{ position: "fixed", bottom: 0, maxWidth: 331 }}>
      <Image src="/images/rodapeDW_xs.png" layout="fixed" width={331} height={57} />
    </div>
  );
}
