import React from "react";
import { useSelector } from "react-redux";
import listAllCapabilities from "@/services/ocs/capabilities";
import { PropsUserSelector } from "../../types";
import CONSTANTS from "@/constants/index";
// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  console.log(userRdx.user.id);
  async function Capabilitie() {
    try {
      const listG = await listAllCapabilities();

      console.log(listG);
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
              <button type="button" onClick={Capabilitie}>
                List All Capabilities
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
