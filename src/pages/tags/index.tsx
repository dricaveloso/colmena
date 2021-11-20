// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "../../types";
import capabilities from "@/services/ocs/capabilities";

// import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

import { listAllTags } from "../../services/tags/tags";

export default function OCS() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  // const [data, setData] = useState([]);
  // const directory = "";
  // async function ResetPass() {
  //   try {
  //     const resetPassU = await resetPass("nil", "rocha123");
  //     console.log(resetPassU);
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  // }
  async function ListCababilities() {
    try {
      const listC = await capabilities();
      console.log(listC);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function ListTags() {
    try {
      const listT = await listAllTags();
      console.log(listT);
    } catch (e) {
      console.log("error", e);
    }
  }
  return (
    <LayoutApp title="title">
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
        <div style={{ width: "100vw", margin: 5 }}>
          <FlexBox>
            <div>
              <button type="button" onClick={ListCababilities}>
                Listar Capabilities
              </button>
              <button type="button" onClick={ListTags}>
                Listar Tags
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
