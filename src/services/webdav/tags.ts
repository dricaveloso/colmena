import davAxiosConnection from "@/services/webdav/axiosConnection";
import { removeCornerSlash } from "@/utils/utils";
import { DAVResultResponseProps } from "webdav";

interface DAVFileIdResultResponseProps extends DAVResultResponseProps {
  fileid?: number;
}

interface SearchInterface {
  [key: string]: any;
  systemtag?: string | number;
  fileid?: string | number;
}

export interface ItemTagInterface {
  id: string | null;
  "display-name": string | null;
  "user-visible": string | null;
  "user-assignable": string | null;
}

export async function listTags() {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
                    <a:prop>
                        <oc:display-name/>
                        <oc:user-visible/>
                        <oc:user-assignable/>
                        <oc:id/>
                    </a:prop>
                </a:propfind>`;
  const result = await davAxiosConnection(body, "systemtags");
  return result.multistatus.response;
}

export async function getFileId(userId: string, path: string) {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
                  <a:prop>
                    <oc:fileid/>
                  </a:prop>
                </a:propfind>`;
  const result = await davAxiosConnection(body, `files/${userId}/${removeCornerSlash(path)}`);
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    const { prop }: { prop: DAVFileIdResultResponseProps } =
      result.multistatus.response[0].propstat;
    return prop.fileid;
  }

  return false;
}

export async function getFileTags(userId: string, path: string, fileId?: string | number) {
  if (!fileId) {
    const fileId = await getFileId(userId, path);
    if (!fileId) {
      return false;
    }
  }

  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
                  <a:prop>
                      <oc:display-name/>
                      <oc:user-visible/>
                      <oc:user-assignable/>
                      <oc:id/>
                  </a:prop>
                </a:propfind>`;
  const result = await davAxiosConnection(body, `systemtags-relations/files/${fileId}`);
  if (result.multistatus.response) {
    const tags: ItemTagInterface[] = [];
    Object.assign(result.multistatus.response).forEach((item: any) => {
      if (typeof item.propstat.prop === "object" && item.propstat.prop?.id) {
        const { prop }: { prop: ItemTagInterface } = item.propstat;
        console.log(prop);
        tags.push(prop);
      }
    });

    console.log(tags);

    return tags;
  }

  return false;
}

export async function search(filters: SearchInterface, props?: string[]) {
  let arrayProps: string[] = [
    "d:getcontentlength",
    "d:getcontenttype",
    "d:getetag",
    "d:getlastmodified",
    "d:lockdiscovery",
    "d:resourcetype",
    "oc:comments-unread",
    "oc:favorites",
    "oc:fileid",
    "oc:owner-display-name",
    "oc:permissions",
    "oc:share-types",
    "oc:size",
    "oc:tags",
  ];

  if (props) {
    arrayProps = props;
  }

  let xmlProps = "";
  Object.keys(arrayProps).forEach((prop: string, index: number) => {
    xmlProps += `<${arrayProps[index]} />\n`;
  });

  let xmlFilters = "";
  if (filters) {
    Object.keys(filters).forEach((filter: string) => {
      xmlFilters += `<oc:${filter}>${filters[filter]}</oc:${filter}>\n`;
    });
  }

  const body = `<oc:filter-files  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
                  <d:prop>
                    ${xmlProps}
                  </d:prop>
                  <oc:filter-rules>
                      ${xmlFilters}
                  </oc:filter-rules>
                </oc:filter-files>`;
  console.log(body);
  const result = await davAxiosConnection(
    body,
    `webdav`,
    "REPORT",
    { "Content-Type": "text/xml" },
    true,
  );
  return result.multistatus.response;
}

export async function getDataFile(userId: string, path: string) {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <d:propfind  xmlns:d="DAV:"
                  xmlns:oc="http://owncloud.org/ns"
                  xmlns:nc="http://nextcloud.org/ns"
                  xmlns:ocs="http://open-collaboration-services.org/ns">
                  <d:prop>
                    <d:getlastmodified />
                    <d:getetag />
                    <d:getcontenttype />
                    <d:resourcetype />
                    <oc:fileid />
                    <oc:permissions />
                    <oc:size />
                    <d:getcontentlength />
                    <nc:has-preview />
                    <nc:mount-type />
                    <nc:is-encrypted />
                    <ocs:share-permissions />
                    <oc:tags />
                    <oc:display-name/>
                    <oc:user-visible/>
                    <oc:user-assignable/>
                    <oc:id/>
                    <oc:favorite />
                    <oc:comments-unread />
                    <oc:owner-id />
                    <oc:owner-display-name />
                    <oc:share-types />

                    <oc:created-at />
                    <oc:title />
                    <oc:description />
                    <oc:language />

                  </d:prop>
                </d:propfind>`;
  const result = await davAxiosConnection(body, `files/${userId}/${removeCornerSlash(path)}`);
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    return result.multistatus.response[0].propstat.prop;
  }

  return false;
}
