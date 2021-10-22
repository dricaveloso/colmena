import React, { useState } from "react";
<<<<<<< HEAD
import { useSelector } from "react-redux";

import { PropsUserSelector } from "../../types";
import {
  listAllTalk,
  listEspecificChat,
  listOpenChat,
  SetROChat,
  participants,
  SetDescription,
} from "@/services/talk/listAll";
=======
// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "@/types/index";
import listTalks from "@/services/talk/listAll";
>>>>>>> e9697cc5dca389df92420ef7c97be90c321d4ca5
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
      const listT = await listAllTalk();

      console.log(listT);
      setData([]);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function listOneChat() {
    const listEspecif = await listEspecificChat("6vku6s5z");
    console.log(listEspecif);
  }
  async function listOpen() {
    const listOpen = await listOpenChat();
    console.log(listOpen);
  }
  async function setRO() {
    const RO = await SetROChat("p3gevuzt");
    console.log(RO);
  }
  async function getParticipants() {
    const Pa = await participants("8zhd8x4p");
    console.log(Pa);
  }
  async function setDescription() {
    const Pa = await SetDescription("8zhd8x4p", "test description");
    console.log(Pa);
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
          <FlexBox>
            <div>
              <button type="button" onClick={listOneChat}>
                List One
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listOpen}>
                List open conversations
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={setRO}>
                set Read-only
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={getParticipants}>
                list Participants
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={setDescription}>
                set Description
              </button>
            </div>
          </FlexBox>
          <VerticalListWebDav data={data} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
