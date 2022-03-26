/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { PropsUserSelector } from "../types";
import { signOut, getSession } from "next-auth/client";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import FullCenterContainer from "@/components/ui/FullCenterContainer";
import { parseCookies } from "nookies";

type Props = {
  statusCode: any;
};

function Error({ statusCode }: Props) {
  const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const locale = cookies.NEXT_LOCALE || "en";

  const init = async () => {
    let url = "/login";
    const currentPath = document.location.href.replace(/^.+?\/\/[^/]+(.+)/, "$1");
    if (currentPath) {
      url += `?redirect=${currentPath}`;
    }

    if (!statusCode) {
      const session = await getSession();
      if (!session || !userRdx?.user) {
        dispatch({ type: "USER_LOGGED_OUT" });
        await signOut({ redirect: false });
        router.push(url, "", {
          locale,
        });
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (statusCode) {
    return (
      <FullCenterContainer>
        <ResourceUnavailable
          icon={statusCode === 500 ? "error" : "error_outline"}
          title={statusCode}
        />
      </FullCenterContainer>
    );
  }

  return null;
}

type InitialProps = {
  res: any;
  err: any;
};

Error.getInitialProps = ({ res, err }: InitialProps) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
