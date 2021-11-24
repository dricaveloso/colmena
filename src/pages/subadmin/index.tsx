import React from "react";
import { useSelector } from "react-redux";
import listAllCapabilities from "@/services/ocs/capabilities";
import { PropsUserSelector } from "../../types";
import CONSTANTS from "@/constants/index";
// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";
// import { listGroupsUser } from "../../services/ocs/users";
import {
  listAllGroups,
  listGroupFolders,
  listUsers,
  createOneUser,
  setGroupOneUser,
  listGroupOneUser,
  suadminGroup,
} from "../../services/ocs/groupFolders";
import { listOneUser } from "../../services/ocs/users";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  console.log(userRdx.user.id);
  async function Capabilitie() {
    try {
      const listC = await listAllCapabilities();

      console.log(listC);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function ListGroups() {
    try {
      const listG = await listAllGroups();

      console.log(listG);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function listGFolders() {
    try {
      const listG = await listGroupFolders();

      console.log(listG);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function users() {
    try {
      const listG = await listUsers();
      console.log(listG.data.ocs.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function createUser() {
    try {
      const listG = await createOneUser();
      console.log(listG.data.ocs.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function setGroup() {
    try {
      const listG = await setGroupOneUser("Myriam Teste");
      console.log(listG.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function listGroup() {
    try {
      const listG = await listGroupOneUser("Myriam Teste");
      console.log(listG.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function setSubadmin() {
    try {
      const listG = await suadminGroup("Myriam Teste");
      console.log(listG.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function listUser() {
    try {
      const listG = await listOneUser("Myriam Teste");
      console.log(listG.data.ocs.data);
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
          <FlexBox>
            <div>
              <button type="button" onClick={ListGroups}>
                List All Groups
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div></div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listGFolders}>
                list Grop Folders
              </button>
            </div>
            <div></div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={users}>
                list All users
              </button>
              <button type="button" onClick={createUser}>
                Create a subadmin
              </button>
              <button type="button" onClick={setGroup}>
                set Group
              </button>
            </div>
            <div>
              <button type="button" onClick={listGroup}>
                List Group User
              </button>
              <button type="button" onClick={setSubadmin}>
                Set Subadmin
              </button>
            </div>
            <div>
              <button type="button" onClick={listUser}>
                List User
              </button>
            </div>
          </FlexBox>

          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
