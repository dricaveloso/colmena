import React from "react";
import Box from "@material-ui/core/Box";
import Honeycomb from "./Honeycomb";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";
import { RoomItemInterface } from "@/interfaces/talk";

interface Props {
  data: RoomItemInterface[];
}

export default function GalleryHorizontalScroll({ data }: Props) {
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: "90%" }}>
        {data.map((item) => (
          <div key={uuid()}>
            <Honeycomb title={item.name} image="/images/honeycombs/example1.png" />
          </div>
        ))}
      </div>
    </Box>
  );
}
