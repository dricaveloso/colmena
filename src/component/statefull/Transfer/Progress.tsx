/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { getByTempfilename as getTransferByTempfilename } from "@/store/idb/models/transfers";
import { useDispatch } from "react-redux";
import { updateStatus } from "@/store/actions/transfers";
import { StatusTransferItemProps } from "@/types/index";
import { TransferStatusEnum } from "@/enums/index";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  boxCircularProgress: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  const classes = useStyles();
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box className={classes.boxCircularProgress}>
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(
            // eslint-disable-next-line react/destructuring-assignment
            props.value,
          )}%`}
        </Typography>
      </Box>
    </Box>
  );
}

type Props = {
  tempFilename: string;
  status: StatusTransferItemProps;
};

export default function Progress({ tempFilename, status }: Props) {
  const [progress, setProgress] = useState(status === TransferStatusEnum.COMPLETE ? 100 : 0);
  const dispatch = useDispatch();

  const load = async () => {
    if (status !== TransferStatusEnum.COMPLETE) {
      const transfer = await getTransferByTempfilename(tempFilename);
      if (transfer) {
        if (transfer.status === TransferStatusEnum.IN_PROGRESS) setProgress(transfer.progress);
        else if (transfer.status === TransferStatusEnum.COMPLETE) {
          dispatch(updateStatus(tempFilename, TransferStatusEnum.COMPLETE));
          setProgress(100);
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      load();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} />;
}