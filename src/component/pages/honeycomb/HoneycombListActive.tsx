import React, { useState, useEffect } from "react";
import { RoomItemInterface } from "@/interfaces/talk";
import HoneycombListItem from "./HoneycombListItem";
import { useSelector, useDispatch } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
import { filterHoneycombs } from "@/pages/honeycomb";
import { setHoneycombs } from "@/store/actions/honeycomb/index";
import { orderByLastActivity } from "./HoneycombList";
import AlertInfoCenter from "@/components/ui/AlertInfoCenter";

type Props = {
  data: RoomItemInterface[];
};
function HoneycombListActive({ data }: Props) {
  const dispatch = useDispatch();
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const [honeycombsList, setHoneycombsList] = useState<RoomItemInterface[]>(
    honeycombRdx.honeycombs,
  );

  const honeycombsTokenArchive = honeycombRdx.honeycombsArchived;

  useEffect(() => {
    const items = filterHoneycombs(data)
      .sort(orderByLastActivity)
      .filter((item) => !honeycombsTokenArchive.includes(item.token));
    setHoneycombsList(items);
    setTimeout(() => {
      dispatch(setHoneycombs(items));
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (honeycombsList.length === 0) return <AlertInfoCenter />;

  return (
    <>
      {honeycombsList.map((item: RoomItemInterface) => (
        <HoneycombListItem data={item} archived={false} />
      ))}
    </>
  );
}

export default HoneycombListActive;
