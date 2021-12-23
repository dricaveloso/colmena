/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Box from "@material-ui/core/Box";
import { MemoizedItemList } from "./ItemList";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";

type Props = {
  token: string;
};

export function Chat({ token }: Props) {
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const { chatMessagesBlockLoad } = honeycombRdx;

  return (
    <Box>
      {chatMessagesBlockLoad
        .filter((item) => item.token === token)
        .map((item, idx) => (
          <MemoizedItemList {...item} idxElem={idx} />
        ))}
    </Box>
  );
}

export const MemoizedChat = React.memo(Chat);
