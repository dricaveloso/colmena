import { createClient } from "webdav";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default function webdav(
  context = "files",
  customCredentials: { username: string; password: string } | null = null,
) {
  if (!customCredentials) {
    const { password, id: username } = initializeStore({}).getState().user.user;
    const client = createClient(`${publicRuntimeConfig.api.baseUrl}/remote.php/dav/${context}/`, {
      username,
      password,
    });
    return client;
  }

  const client = createClient(`${publicRuntimeConfig.api.baseUrl}/remote.php/dav/${context}/`, {
    ...customCredentials,
  });
  return client;
}
