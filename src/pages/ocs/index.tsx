import React from "react";
import { useSelector } from "react-redux";

import { PropsUserSelector } from "@/types/index";
import capabilities from "@/services/ocs/capabilities";

import {
  listAllUsers,
  listOneUser,
  enableUser,
  disableUser,
  welcomeUser,
  deleteUser,
  listGroupsUser,
} from "@/services/ocs/users";

import CONSTANTS from "@/constants/index";
// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  // const [data, setData] = useState([]);
  // const directory = "";

  async function ListAllU() {
    try {
      const listU = await listAllUsers();

      console.log(listU);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function ListOneU() {
    try {
      const listU = await listOneUser(userRdx.user.id);

      console.log(listU);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function EnableUser() {
    try {
      const enableU = await enableUser(userRdx.user.id);

      console.log(enableU);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function DisableUser() {
    try {
      const disableU = await disableUser(userRdx.user.id);

      console.log(disableU);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function WelcomeUser() {
    try {
      const welcomeU = await welcomeUser(userRdx.user.id);

      console.log(welcomeU);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function DeleteUser() {
    try {
      const deleteU = await deleteUser("maria2321");
      console.log(deleteU);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function ListCababilities() {
    try {
      const listC = await capabilities();
      console.log(listC);
    } catch (e) {
      console.log("error", e);
    }
  }

  async function ListGroupUser() {
    try {
      const LGU = await listGroupsUser(userRdx.user.id);

      console.log(LGU);
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
              <button type="button" onClick={ListAllU}>
                Listar Users
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={ListOneU}>
                Especific User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={ListGroupUser}>
                List Gropu User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={EnableUser}>
                Enable User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={DisableUser}>
                Disable User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={WelcomeUser}>
                Welcome User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={DeleteUser}>
                Delete User
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={ListCababilities}>
                Listar Capabilities
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}