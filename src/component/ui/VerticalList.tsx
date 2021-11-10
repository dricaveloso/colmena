import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Text from "@/components/ui/Text";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import { VerticalItemListInterface } from "@/interfaces/index";
import VerticalItemList from "@/components/ui/VerticalItemList";
import { v4 as uuid } from "uuid";

type Props = {
  title?: string;
  data: VerticalItemListInterface[];
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
      <List>
        {data.map((item) => (
          <ListItem key={uuid()} divider disableGutters>
            <VerticalItemList {...item} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
