/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { getAllContents } from "@/services/webdav/directories";
import router from "next/router";
import Clickable from "@/components/ui/Clickable";

const FilesInfoSection = () => {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const { t } = useTranslation("common");
  const { t: h } = useTranslation("home");
  const { t: l } = useTranslation("library");

  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });
  const [data, setData] = useState<LibraryItemInterface[]>([]);
  const [sharedData, setSharedData] = useState<LibraryItemInterface[]>([]);

  const mountItems = async () => {
    try {
      const contents = await getAllContents(userRdx.user.id);
      const talk = await getItems("Talk", userRdx.user.id, timeDescription, l);
      setSharedData(talk);
      setData(contents.filter((item: any) => item.type !== "directory"));
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
          <Clickable handleClick={() => router.push(`/library/${userRdx.user.id}`)}>
            <Item title={h("myFilesLabel")} amount={data.length} />
          </Clickable>
          <Clickable handleClick={() => router.push("/library/Talk")}>
            <Item title={h("sharedLabel")} amount={sharedData.length} />
          </Clickable>
          {/* <Item title={h("publicLabel")} amount={0} /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default FilesInfoSection;
