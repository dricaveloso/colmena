import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PropsUserSelector } from "../../types";
import ListUsers from "@/services/ocs/users";
import capabilities from "@/services/ocs/capabilities";

import CONSTANTS from "@/constants/index";
import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

export default function OCS() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [data, setData] = useState([]);
  const directory = "";

  async function ListAllUsers() {
    try {
      const listU = await ListUsers();

      console.log(listU);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function ListCababilities() {
    // try {
    //   const listC = await capabilities();
    //   console.log(listC);
    // } catch (e) {
    //   console.log("error", e);
    // }
  }

  const cap = () => {
    const url = `https://claudio.colmena.network/ocs/v2.php/cloud/users`;
    const options = {
      method: "GET",
      mode: "cors",
      cache: "default",
    };
    fetch(`https://claudio.colmena.network/ocs/v2.php/cloud/users`, options)
      .then((response) => {
        response.json();
      })
      .catch((e) => console.log("Deu error ", e));
  };
  return (
    <LayoutApp title={CONSTANTS.APP_NAME}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <div style={{ width: "100vw", margin: 5 }}>
          <FlexBox>
            <div>
              <button type="button" onClick={ListAllUsers}>
                Listar Users
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={cap}>
                Listar Capabilities
              </button>
            </div>
          </FlexBox>

          <VerticalListWebDav data={data} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
