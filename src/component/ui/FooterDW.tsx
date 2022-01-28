import React from "react";
import Image from "next/image";
import Box from "@material-ui/core/Box";

export default function FooterDW() {
  return (
    <Box
      position="fixed"
      bottom={0}
      width="100%"
      display="flex"
      flex={1}
      padding={2}
      justifyContent="center"
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <Image src="/images/rodapeDW_xs.png" layout="fixed" width={331} height={57} />
    </Box>
  );
}
