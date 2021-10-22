import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "@/types/index";
import listTalks from "@/services/talk/room";
import CONSTANTS from "@/constants/index";
import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/index";
import FlexBox from "@/components/ui/FlexBox";

export default function OCS() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

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
