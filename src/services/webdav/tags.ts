import davAxiosConnection from "@/services/webdav/axiosConnection";

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

export async function returnTagsFile(fileId = 4514) {
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
  return result.multistatus.response;
}
