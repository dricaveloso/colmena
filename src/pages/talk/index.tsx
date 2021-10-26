import React, { useState } from "react";
import { useSelector } from "react-redux";

import { PropsUserSelector } from "../../types";
import {
  listAllTalk,
  listEspecificChat,
  listOpenChat,
  SetROChat,
  participants,
  SetDescription,
  postCreateConversation,
  postNewParticipant,
  postPublicConvertion,
} from "@/services/talk/listAll";
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
    const listEspecif = await listEspecificChat("6rd8qc4j");
    console.log(listEspecif);
  }
  async function listOpen() {
    const listOpen = await listOpenChat();
    console.log(listOpen);
  }
  async function setRO() {
    const RO = await SetROChat("6rd8qc4j");
    console.log(RO);
  }
  async function getParticipants() {
    const Pa = await participants("6rd8qc4j");
    console.log(Pa);
  }
  async function setDescription() {
    const Pa = await SetDescription("6rd8qc4j", "test description");
    console.log(Pa);
  }
  async function createConversation() {
    const create = await postCreateConversation(2, "testeAPI");
    console.log(create);
  }
  async function newParticipant() {
    const create = await postNewParticipant("6rd8qc4j", "makena", "users");
    console.log(create);
  }
  // async function publicConversation() {
  //   const pConvesation = await postPublicConvertion("6rd8qc4j", 1);
  // }
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
              <button type="button" onClick={createConversation}>
                Create Conversation
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
              <button type="button" onClick={getParticipants}>
                list Participants
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={newParticipant}>
                add Participant
              </button>
            </div>
          </FlexBox>
          {/* <FlexBox>
            <div>
              <button type="button" onClick={publicConversation}>
                Public Conversation
              </button>
            </div>
          </FlexBox> */}
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
