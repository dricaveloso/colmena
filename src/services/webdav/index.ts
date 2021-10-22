import { AuthType, createClient } from "webdav";
import { initializeStore } from "@/store/index";

export default function webdav() {
  // const { password, email: username } = initializeStore({}).getState().user.user;
  const { userToken } = initializeStore({}).getState().user.user;

  const client = createClient(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/remote.php/dav/files/`,

    {
      authType: AuthType.Token,
      // username,
      // password,
      token: {
        access_token: userToken,
        token_type: "Bearer",
      },
    },
  );
  return client;
}
