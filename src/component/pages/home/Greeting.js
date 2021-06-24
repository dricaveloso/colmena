import React from "react";
import MediaAvatar from "component/pages/home/MediaAvatar";
import { Grow } from "@material-ui/core";
import theme from "styles/theme";

function Greeting({ showGreeting }) {
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
        <MediaAvatar size={17} />
        <p style={{ fontSize: 20 }}>
          <strong>Seja bem vindo(a)</strong>
        </p>
        <span>Makena</span>
      </div>
    </Grow>
  );
}

export default Greeting;
