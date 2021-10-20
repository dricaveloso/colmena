import React, { useState } from "react";
import { useSelector } from "react-redux";

import { PropsUserSelector } from "../../types";
import listTalks from "@/services/talk/listAll";
import CONSTANTS from "@/constants/index";
import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  console.log(userRdx.user.id);

  const [data, setData] = useState([]);
  // const directory = "";

  async function ListAllT() {
    try {
      const listT = await listTalks();

      console.log(listT);
      setData([]);
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <LayoutApp title={CONSTANTS.APP_NAME}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <div style={{ width: "100vw", margin: 5 }}>
          <FlexBox>
            <div>
              <button type="button" onClick={ListAllT}>
                List All
              </button>
            </div>
          </FlexBox>
          <VerticalListWebDav data={data} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
