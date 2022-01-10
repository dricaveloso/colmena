import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";

export default function SkeletonComp() {
  return (
    <Box display="flex" flex={1} flexDirection="row" justifyContent="space-between">
      <Skeleton variant="circle" style={{ marginRight: 10 }} width={60} height={60} />
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        alignContent="flex-start"
      >
        <Skeleton variant="text" width={150} />
        <Skeleton variant="text" width={40} height={10} />
        <Skeleton variant="text" width={100} />
      </Box>
    </Box>
  );
}
