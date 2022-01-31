/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { useTranslation } from "react-i18next";
import Item from "./Item";
import { getItems } from "../../library";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";

const FilesInfoSection = () => {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const { t } = useTranslation("common");
  const { t: h } = useTranslation("home");

  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });
  const [data, setData] = useState<LibraryItemInterface[]>([]);
  const [sharedData, setSharedData] = useState<LibraryItemInterface[]>([]);
  const [subPastLenght, setSubPathLength] = useState<LibraryItemInterface[]>([]);
  const mountItems = async () => {
    try {
      const items = await getItems(userRdx.user.id, userRdx.user.id, timeDescription);
      items.forEach(async (item) => {
        if (item.type === "directory") {
          const itemDirectory = await getItems(item.filename, userRdx.user.id, timeDescription);
          // @ts-ignore
          setSubPathLength([...subPastLenght, itemDirectory]);
        }
      });

      const talk = await getItems("Talk", userRdx.user.id, timeDescription);
      setSharedData(talk);
      setData(items);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    mountItems();
    return () => {
      setData([]);
    };
  }, []);

  return (
    <Box
      padding={3}
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      style={{ width: "100%", marginTop: "20px" }}
      data-testid="ui-file-info"
    >
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        marginLeft={2}
        justifyContent="flex-start"
      >
        <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-around">
          <Item title={h("myFilesLabel")} amount={data.length + subPastLenght.length} />
          <Item title={h("sharedLabel")} amount={sharedData.length} />
          <Item title={h("publicLabel")} amount={0} />
        </Box>
      </Box>
    </Box>
  );
};

export default FilesInfoSection;
