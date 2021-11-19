// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "../../types";
// import capabilities from "@/services/ocs/capabilities";
// import CONSTANTS from "@/constants/index";
// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
// import LayoutApp from "@/components/statefull/LayoutApp";
// import { JustifyContentEnum } from "@/enums/*";
// import FlexBox from "@/components/ui/FlexBox";
// import { Box, Button } from "@material-ui/core";

// export default function OCS() {
//   const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
//   // const [data, setData] = useState([]);
//   // const directory = "";
//   // async function ResetPass() {
//   //   try {
//   //     const resetPassU = await resetPass("nil", "rocha123");
//   //     console.log(resetPassU);
//   //   } catch (e) {
//   //     console.log("error", e);
//   //   }
//   // }
//   // async function ListCababilities() {
//   //   try {
//   //     const listC = await capabilities();
//   //     console.log(listC);
//   //   } catch (e) {
//   //     console.log("error", e);
//   //   }
//   // }
//   // return (
//   //     <LayoutApp title={l("title")} >
//   //       <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
//   //         <div style={{ width: "100vw", margin: 5 }}>
//   //           <FlexBox>
//   //             <div>
//   //               <button type="button" onClick={ListCababilities()}>
//   //                 Listar Capabilities
//   //               </button>
//   //               <Button color="primary"  onClick={ListCababilities}
//   //             </Button>
//   //             </div>
//   //           </FlexBox>
//   //           <VerticalListWebDav data={data} />
//   //         </div>
//   //       </FlexBox>
//   //     </LayoutApp>
//   // );
// }
