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
} from "../../services/ocs/groupFolders";

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
  async function createGroup() {
    try {
      const listG = await createOneGroup("testeAPI");

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
            <div>
              <button type="button" onClick={createGroup}>
                create One Group
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={createGFolders}>
                create Grop Folders
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listGFolders}>
                list Grop Folders
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={givGF}>
                give a group access to a folder
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={quota}>
                qota a group folder
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={users}>
                list All users
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
