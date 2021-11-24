// import capabilities from "@/services/ocs/capabilities";
import axios from "axios";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";
import xml2js from "xml2js";

import { assingTagFile, createAndAssignTags } from "../../services/tags/tags";

export default function OCS() {
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
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
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
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
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
  async function createAssingTag() {
    try {
      const createT = await createAndAssignTags(5025);
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
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function returnFileId() {
    const data = `<?xml version="1.0" encoding="utf-8" ?>
        <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
          <a:prop>
            <oc:fileid/>
          </a:prop>
        </a:propfind>`;
    const config = {
      method: "propfind",
      url: "https://claudio.colmena.network/remote.php/dav/files/nilson/private/",
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
        Authorization:
          "Bearer zIBhpCVNZY8pzHIiBOTX2zUmO229J2RQ45FDe9pPoPjfMaAZQvVzKdRwTtNZDsxK4mRIWAXP",
        "Content-Type": "application/xml",
      },
      data,
    };

    axios(config)
      .then((response) => {
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function returnTagsFile() {
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
      url: "https://claudio.colmena.network/remote.php/dav/systemtags-relations/files/5025",
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
        Authorization:
          "Bearer zIBhpCVNZY8pzHIiBOTX2zUmO229J2RQ45FDe9pPoPjfMaAZQvVzKdRwTtNZDsxK4mRIWAXP",
        "Content-Type": "application/xml",
      },
      data,
    };

    axios(config)
      .then((response) => {
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function AsstagInFile() {
    try {
      const assTagFile = await assingTagFile(5070, 7);
      console.log(assTagFile);
    } catch (e) {
      console.log("error", e);
    }
  }
  async function retrieveTagsFile() {
    const data = `<oc:filter-files  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
          <d:prop>
                  <d:getcontentlength />
                  <d:getcontenttype />
                  <d:getetag />
                  <d:getlastmodified />
                  <d:lockdiscovery />
                  <d:resourcetype />
                  <oc:comments-unread />
                  <oc:favorites />
                  <oc:fileid />
                  <oc:owner-display-name />
                  <oc:permissions />
                  <oc:share-types />
                  <oc:size />
                  <oc:tags />
            </d:prop>
              <oc:filter-rules>
                  <oc:systemtag>7</oc:systemtag>
              </oc:filter-rules>
            </oc:filter-files>`;

    const config = {
      method: "report",
      url: "https://claudio.colmena.network/remote.php/webdav",
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
        Authorization:
          "Bearer zIBhpCVNZY8pzHIiBOTX2zUmO229J2RQ45FDe9pPoPjfMaAZQvVzKdRwTtNZDsxK4mRIWAXP",
        "Content-Type": "application/xml",
      },
      data,
    };

    axios(config)
      .then((response) => {
        xml2js.parseString(response.data, (err, result) => {
          if (err) {
            throw err;
          }
          const json = JSON.stringify(result, null, 4);
          console.log(json);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <LayoutApp title="title">
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
        <div style={{ width: "100vw", margin: 5 }}>
          {/* <FlexBox>
            <div>
              <button type="button" onClick={ListCababilities}>
                Listar Capabilities
              </button>
            </div>
          </FlexBox> */}
          <FlexBox>
            <div>
              <button type="button" onClick={listTags}>
                Listar Tags
              </button>
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
              <button type="button" onClick={editTag}>
                Editar One Tags
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={returnFileId}>
                File Id
              </button>
              <button type="button" onClick={returnTagsFile}>
                tags File
              </button>
            </div>
            <div>
              <button type="button" onClick={createAssingTag}>
                Create and Assing tags File
              </button>
              <button type="button" onClick={AsstagInFile}>
                Assing tags File
              </button>
            </div>
          </FlexBox>
          <FlexBox>
            <div>
              <button type="button" onClick={retrieveTagsFile}>
                Retrieve all files with a tag Id
              </button>
            </div>
          </FlexBox>
          {/* <VerticalListWebDav data={data} /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
