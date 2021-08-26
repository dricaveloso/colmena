/* eslint-disable space-infix-ops */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";
import constants from "@/constants/index";
import { searchByTerm } from "@/utils/utils";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const responseToken = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/core/getapppassword`,
            {
              auth: {
                username: email,
                password,
              },
              headers: {
                "OCS-APIRequest": true,
              },
            },
          );

          const userToken = responseToken.data.ocs.data.apppassword;
          const headers = {
            "OCS-APIRequest": true,
            Authorization: `Bearer ${userToken}`,
          };

          const responseUser = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud/user`,
            {
              headers,
            },
          );
          const dataUser = responseUser.data.ocs.data;
          const responseMedia = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud/capabilities`,
            {
              headers,
            },
          );
          const dataMedia = responseMedia.data.ocs.data.capabilities.theming;

          if (!responseUser.data.ocs.data.groups.includes("admin")) {
            throw new Error("permissionDenied");
          }
          // eslint-disable-next-line camelcase
          const {
            id,
            groups,
            twitter,
            website,
            "display-name": name,
            email: emailUser,
            language,
          } = dataUser;
          const { name: mediaName, url, slogan, logo } = dataMedia;

          let userLang = constants.DEFAULT_LANGUAGE;
          if (Object.values(constants.LOCALES).includes(language)) userLang = language;

          return {
            id,
            name,
            website,
            email: emailUser,
            language: userLang,
            groups,
            twitter,
            userToken,
            media: {
              name: mediaName,
              url,
              slogan,
              logo,
            },
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
