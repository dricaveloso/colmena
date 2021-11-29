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
  createOneGroup,
  createGroupFolders,
  listGroupFolders,
  givGroupFoldersAGroup,
  quotaGroupFolders,
  listUsers,
  // createOneUser,
  setGroupOneUser,
  // listGroupOneUser,
  suadminGroup,
} from "../../services/ocs/servicesAdminSubadmin";
import { createUser, listOneUser } from "../../services/ocs/users";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  if (!userRdx.user.groups.includes("admin")) {
    throw new Error("permissionDenied");
  }
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
  async function createGroup() {
    try {
      const listG = await createOneGroup();

      console.log(listG);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function createGFolders() {
    try {
      const listG = await createGroupFolders();

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
  async function givGF() {
    try {
      const listG = await givGroupFoldersAGroup(28);
      console.log(listG);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function quota() {
    try {
      const listG = await quotaGroupFolders(28);
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
  async function create() {
    try {
      const listC = await createUser("teste", "teste@teste.com", ["devteam57"], "1GB", [
        "devteam57",
      ]);

      console.log(listC);
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
  // async function listGroup() {
  //   try {
  //      const listG = await listGroupOneUser("Myriam Teste");
  //     console.log(listG.data);
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  // }
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
              <button type="button" onClick={createGroup}>
                create One Group
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
              <button type="button" onClick={createGFolders}>
                create Grop Folders
              </button>
            </div>
            <div>
              <button type="button" onClick={givGF}>
                give a group access to a folder
              </button>
              <button type="button" onClick={quota}>
                quota a group folder
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={users}>
                list All users
              </button>
              <button type="button" onClick={create}>
                Create a subadmin
              </button>
              <button type="button" onClick={setGroup}>
                set Group
              </button>
            </div>
            <div>
              {/* <button type="button" onClick={listGroup}>
                List Group User
              </button> */}
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
