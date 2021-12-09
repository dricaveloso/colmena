import davAxiosConnection from "@/services/webdav/axiosConnection";
import { webdavAxios } from "@/services/webdav";
import { getFileId } from "@/services/webdav/files";

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

export async function createTag(name: string) {
  return webdavAxios().post("/systemtags", {
    name,
    userVisible: "true",
    userAssignable: "true",
  });
}

export async function assignTagFile(fileId: number, tagId: number) {
  return webdavAxios().put(`/systemtags-relations/files/${fileId}/${tagId}`);
}

export async function createAndAssignTagFile(fileId: number, tagName: string) {
  return webdavAxios().post(`/systemtags-relations/files/${fileId}`, {
    name: tagName,
    userVisible: "true",
    userAssignable: "true",
  });
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
        tags.push(prop);
      }
    });

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
