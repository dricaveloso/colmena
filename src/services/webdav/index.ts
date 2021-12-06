// import { AuthType, createClient } from "webdav";
import { createClient } from "webdav";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default function webdav(
  customCredentials: { username: string; password: string } | null = null,
) {
  if (!customCredentials) {
    const { password, id: username } = initializeStore({}).getState().user.user;
    const client = createClient(`${publicRuntimeConfig.api.baseUrl}/remote.php/dav/files/`, {
      username,
      password,
    });
    return client;
  }

  const client = createClient(`${publicRuntimeConfig.api.baseUrl}/remote.php/dav/files/`, {
    ...customCredentials,
  });
  return client;
}
