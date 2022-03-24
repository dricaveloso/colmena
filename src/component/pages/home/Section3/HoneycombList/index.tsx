import React from "react";
import Box from "@material-ui/core/Box";
import Honeycomb from "./Honeycomb";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";
import router from "next/router";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
// import { getRandomInt } from "@/utils/utils";
import { makeStyles } from "@material-ui/core";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Text from "@/components/ui/Text";
import Clickable from "@/components/ui/Clickable";

const useStyles = makeStyles(() => ({
  avatar: {
    width: "100%",
    textAlign: "center",
    marginBottom: 5,
  },
}));

export default function GalleryHorizontalScroll() {
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();

  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const items = honeycombRdx.honeycombs;
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: "100%" }}>
        {items.slice(0, 6).map(({ displayName, token, canDeleteConversation, id }) => (
          <Box
            key={uuid()}
            marginRight={2}
            data-testid={`honeycomb-item-${id}`}
            style={!match ? { width: "23vw" } : { width: 80 }}
          >
            <Clickable
              handleClick={() =>
                router.push(`/honeycomb/${token}/${displayName}/${Number(canDeleteConversation)}`)
              }
            >
              <Box className={classes.avatar}>
                <Honeycomb
                  displayName={displayName}
                  canDeleteConversation={canDeleteConversation}
                  token={token}
                />
              </Box>
              <Text
                variant={TextVariantEnum.SUBTITLE1}
                display={TextDisplayEnum.BLOCK}
                noWrap
                style={{
                  color: theme.palette.primary.dark,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                {displayName}
              </Text>
            </Clickable>
          </Box>
        ))}
      </div>
    </Box>
  );
}
