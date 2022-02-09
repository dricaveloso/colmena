import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "../types";
import { signOut } from "next-auth/client";

type Props = {
  statusCode: any;
};

function Error({ statusCode }: Props) {
  const router = useRouter();
  (async () => {
    if (!statusCode) {
      const userRdx = await useSelector((state: { user: PropsUserSelector }) => state.user);
      if (!userRdx?.user) {
        await signOut({ redirect: false });
        router.push("/login");
      }
    }

    return (
      <p>
        {statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}
      </p>
    );
  })();
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
