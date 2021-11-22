import capabilities from "@/services/ocs/capabilities";
import axios from "axios";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

import {} from "../../services/tags/tags";

export default function OCS() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  // const [data, setData] = useState([]);
  // const directory = "";
  //   async function ResetPass() {
  //     try {
  //       const resetPassU = await resetPass("nil", "rocha123");
  //       console.log(resetPassU);
  //     } catch (e) {
  //       console.log("error", e);
  //     }
  //   }
  async function ListCababilities() {
    try {
      const listC = await capabilities();
      console.log(listC);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function listTags() {
    const data = `<?xml version="1.0" encoding="utf-8" ?>
                    <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
                        <a:prop>
                           <oc:display-name/>
                           <oc:user-visible/>
                           <oc:user-assignable/>
                           <oc:id/>
                        </a:prop>
                    </a:propfind>`;

    const config = {
      method: "propfind",
      url: "https://claudio.colmena.network/remote.php/dav/systemtags",
      headers: {
        "OCS-APIRequest": "true",
        "Content-Type": "application/xml",
        Authorization: "Basic YWRtaW46MzU3N3VtVFVTRDJxdmIz",
      },
      data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function listOneTags() {
    const data = `<?xml version="1.0" encoding="utf-8" ?>
            <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
              <a:prop>
                      <oc:display-name/>
                      <oc:user-visible/>
                      <oc:user-assignable/>
                      <oc:id/>
                </a:prop>
            </a:propfind>`;

    const config = {
      method: "propfind",
      url: "https://claudio.colmena.network/remote.php/dav/systemtags/4",
      headers: {
        "OCS-APIRequest": "true",
        Authorization: "Basic YWRtaW46MzU3N3VtVFVTRDJxdmIz",
        "Content-Type": "application/xml",
      },
      data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function createTag() {
    try {
      const createT = await createTag();
      console.log(createT);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function editTag() {
    const data = `<?xml version="1.0"?>
        <d:propertyupdate  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
             <d:set>
                <d:prop>
                      <oc:display-name>TESTE_API_TAG</oc:display-name>
                </d:prop>
            </d:set>
        </d:propertyupdate>`;

    const config = {
      method: "proppatch",
      url: "https://claudio.colmena.network/remote.php/dav/systemtags/3",
      headers: {
        "OCS-APIRequest": "true",
        Authorization:
          "Bearer uZyERYtHaANEK8nNaPB2V5LTz6iM695zB4bAMryd7032imyVbQyfiI3kNxl3iBhHoMoSGv2O",
        "Content-Type": "text/plain",
      },
      data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
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
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listTags}>
                Listar Tags
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={listOneTags}>
                Listar One Tags
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={createTag}>
                Create Tag
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={editTag}>
                Editar One Tags
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
