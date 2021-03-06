/* eslint-disable space-infix-ops */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";
import constants from "../../../constants";
import { searchByTerm } from "../../../utils/utils";
import { UserInfoInterface } from "../../../interfaces/ocs";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

const baseUrl = `${serverRuntimeConfig.api.baseUrl}/ocs/v2.php`;

function getUserInfo(email: string, password: string): Promise<UserInfoInterface> {
  return axios.get(`${baseUrl}/cloud/user?format=json`, {
    auth: {
      username: email,
      password,
    },
    headers: {
      "OCS-APIRequest": true,
    },
  });
}

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials: { email: string; password: string }) {
        const { email, password } = credentials;
        try {
          const responseUser = await getUserInfo(email, password);
          const dataUser = responseUser.data.ocs.data;

          // eslint-disable-next-line camelcase
          const {
            id,
            enabled,
            groups,
            twitter,
            website,
            "display-name": name,
            email: emailUser,
            subadmin,
            language,
            quota,
          } = dataUser;

          let userLang = constants.DEFAULT_LANGUAGE;
          if (Object.values(constants.LOCALES).includes(language)) userLang = language;

          return {
            id,
            name,
            website,
            lastLogin: dataUser.lastLogin,
            email: emailUser,
            language: userLang,
            groups,
            subadmin,
            quota,
            twitter,
            password,
          };
        } catch (e) {
          const result = searchByTerm(e.message, "permissionDenied")
            ? "permissionDenied"
            : "invalidCredentials";
          throw new Error(result);
        }
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    // async signIn(user, account, profile) {
    //   console.log("EEI", user, account, profile);
    //   return true;
    // },
    // async redirect(url, baseUrl) { return baseUrl },
    async session(session, token) {
      if (token) {
        // @ts-ignore
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
    async jwt(token, user, account, profile) {
      // SIGNIN
      if (account && profile) {
        const { accessToken } = profile;
        delete profile.accessToken;
        return {
          accessToken,
          accessTokenExpires: Date.now() + constants.TOKEN_EXPIRE_SECONDS * 1000,
          user: profile,
        };
      }

      // Subsequent use of JWT, the user has been logged in before
      // access token has not expired yet
      // if (Date.now() < token.accessTokenExpires) {
      return token;
      // }

      // return refreshAccessToken(token);
    },
  },

  // Enable debug messages in the console if you are having problems
  debug: false,
});

/**
 * Takes a token and returns a new one with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token with an error property.
 */
// async function refreshAccessToken(token) {
//   try {
//     const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token/refresh`, {
//       oldToken: token.accessToken,
//     });

//     const result = response.data;
//     return {
//       ...token,
//       accessToken: result.access_token,
//       accessTokenExpires: Date.now() + constants.TOKEN_EXPIRE_SECONDS * 1000,
//     };
//   } catch (error) {
//     console.log("error refresh token", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError", // This is used in the front-end,
// and if present, we can force a re-login, or similar
//     };
//   }
// }
