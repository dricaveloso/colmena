import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Text from "@/components/ui/Text";
import { LibraryItemWebDavInterface } from "@/interfaces/index";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import VerticalItemListWebDav from "@/components/ui/VerticalItemListWebDav";
import { v4 as uuid } from "uuid";

type Props = {
  title?: string;
  data: LibraryItemWebDavInterface[];
};

export default function VerticalList({ title = "", data }: Props) {
  return (
    <div>
      {title !== "" && (
        <div style={{ marginTop: 15, marginBottom: 15 }}>
          <Text variant={TextVariantEnum.SUBTITLE2} align={TextAlignEnum.LEFT}>
            {title}
          </Text>
        </div>
      )}
      {/* <List>
        {data
          ?.filter((item) => item.type !== "directory")
          ?.map((item) => (
            <ListItem key={uuid()} divider disableGutters>
              <VerticalItemListWebDav {...item} />
            </ListItem>
          ))}
      </List> */}
    </div>
  );
}
