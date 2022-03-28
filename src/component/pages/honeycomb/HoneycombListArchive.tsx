import React from "react";
import { RoomItemInterface } from "@/interfaces/talk";
import HoneycombListItem from "./HoneycombListItem";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
import { filterHoneycombs } from "@/pages/honeycomb";
import { orderByLastActivity } from "./HoneycombList";

type Props = {
  data: RoomItemInterface[];
};
function HoneycombListArchive({ data }: Props) {
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  // const [honeycombsList, setHoneycombsList] = useState<RoomItemInterface[]>(
  //   honeycombRdx.honeycombs,
  // );

  const honeycombsTokenArchive = honeycombRdx.honeycombsArchived;

  const items = filterHoneycombs(data)
    .sort(orderByLastActivity)
    .filter((item) => honeycombsTokenArchive.includes(item.token));

  // useEffect(() => {
  //   const items = filterHoneycombs(data)
  //     .sort(orderByLastActivity)
  //     .filter((item) => honeycombsTokenArchive.includes(item.token));
  //   setHoneycombsList(items);
  // }, []);

  return (
    <>
      {items.map((item: RoomItemInterface) => (
        <HoneycombListItem data={item} archived />
      ))}
    </>
  );
}

export default HoneycombListArchive;
