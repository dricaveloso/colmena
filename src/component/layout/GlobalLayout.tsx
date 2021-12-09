import React from "react";

type Props = {
  children: React.ReactNode;
};

function GlobalLayout({ children }: Props) {
  return <>{children}</>;
}

export default GlobalLayout;
