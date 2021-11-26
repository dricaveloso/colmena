import React from "react";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "../../types";
import CONSTANTS from "@/constants/index";
// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";
import { listAllGroups, listUsers } from "../../services/ocs/servicesAdminSubadmin";
import { listOneUser, listGroupsUser, createUser } from "../../services/ocs/users";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  if (userRdx.user.subadmin.includes("")) {
    throw new Error("permissionDenied");
  }
  console.log(userRdx.user.id);
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
  async function createUser1() {
    try {
      const listC = await createUser("teste1", "teste1@teste.com", ["devteam57"], "1GB");

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
  async function users() {
    try {
      const listG = await listUsers();
      console.log(listG.data.ocs.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function groupsUser() {
    try {
      const listG = await listGroupsUser("devteam57");
      console.log(listG.data.ocs.data);
    } catch (e) {
      console.log("error", e);
    }
  }

  // async function setGroup() {
  //   try {
  //     const listG = await setGroupOneUser("Myriam Teste");
  //     console.log(listG.data);
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  // }

  async function listGroupsOneUser() {
    try {
      const listG = await listGroupsUser("teste");

      console.log(listG);
    } catch (e) {
      console.log("error", e);
    }
  }

  // async function setSubadmin() {
  //   try {
  //     const listG = await suadminGroup("teste");
  //     console.log(listG.data);
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  // }
  async function listUser() {
    try {
      const listG = await listOneUser("teste");
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
              <button type="button" onClick={ListGroups}>
                List All Groups
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={users}>
                list All users
              </button>
            </div>
            <div>
              <button type="button" onClick={create}>
                Create a user subAdmin
              </button>
            </div>
            <div>
              <button type="button" onClick={createUser1}>
                Create a user
              </button>
              {/* <button type="button" onClick={setGroup}>
                set Group
              </button> */}
            </div>
            <div></div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listUser}>
                List User
              </button>
              <button type="button" onClick={listGroupsOneUser}>
                List group
              </button>
              <button type="button" onClick={groupsUser}>
                List groups user
              </button>
            </div>
          </FlexBox>

          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
