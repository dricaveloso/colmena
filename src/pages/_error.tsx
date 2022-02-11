/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "../types";
import { signOut, getSession } from "next-auth/client";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import FullCenterContainer from "@/components/ui/FullCenterContainer";

type Props = {
  statusCode: any;
};

function Error({ statusCode }: Props) {
  const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const init = async () => {
    if (!statusCode) {
      const session = await getSession();
      if (!session || !userRdx?.user) {
        await signOut({ redirect: false });
        router.push("/login?out");
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
