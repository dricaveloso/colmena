import React from "react";
import MediaAvatar from "@/components/ui/Avatar";
import { Grow } from "@material-ui/core";
import GreetingMessage from "@/components/pages/home/GreetingMessage";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

type Props = {
  showGreeting: boolean;
};

function Greeting({ showGreeting }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <Grow in={showGreeting} timeout={1500}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <MediaAvatar size={17} name={userRdx?.user.media.name} image={userRdx?.user.media.image} />
        <GreetingMessage />
      </div>
    </Grow>
  );
}

export default Greeting;
