import React from "react";
import Box from "@material-ui/core/Box";
import Honeycomb from "./Honeycomb";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";
import { RoomItemInterface } from "@/interfaces/talk";
import router from "next/router";

interface Props {
  data: RoomItemInterface[];
}

export default function GalleryHorizontalScroll({ data }: Props) {
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  const honeycombData = data.slice(0, 13);
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: "90%" }}>
        {honeycombData.map((item, index) => (
          <div key={uuid()} onClick={() => router.push(`honeycomb/${item.token}`)}>
            <Honeycomb title={item.name} image={`/images/honeycombs/honeycomb${index}.png`} />
          </div>
        ))}
      </div>
    </Box>
  );
}
