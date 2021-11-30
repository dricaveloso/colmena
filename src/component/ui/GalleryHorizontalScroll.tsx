import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";

type Props = {
  children: React.ReactNode;
};

export default function GalleryHorizontalScroll({ children }: Props) {
  const match = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: 600 }}>
      {children}
    </div>
  );
}
