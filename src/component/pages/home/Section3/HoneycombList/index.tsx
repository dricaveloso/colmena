import React from "react";
import Box from "@material-ui/core/Box";
import Honeycomb from "./Honeycomb";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";
import router from "next/router";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
import { getRandomInt } from "@/utils/utils";

export default function GalleryHorizontalScroll() {
  const match = useMediaQuery(theme.breakpoints.up("sm"));

  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const items = honeycombRdx.honeycombs;
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: "90%" }}>
        {items.slice(0, 6).map(({ displayName, token, canDeleteConversation }) => (
          <div
            key={uuid()}
            onClick={() =>
              router.push(`/honeycomb/${token}/${displayName}/${Number(canDeleteConversation)}`)
            }
          >
            <Honeycomb
              title={displayName}
              image={`/images/honeycombs/honeycomb${getRandomInt(0, 13)}.png`}
            />
          </div>
        ))}
      </div>
    </Box>
  );
}
