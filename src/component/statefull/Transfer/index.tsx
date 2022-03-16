import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { PropsTransferSelector, PropsUserSelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { setOpenTransferModal } from "@/store/actions/transfers/index";
import Modal from "@/components/ui/Modal";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import { v4 as uuid } from "uuid";
import Transfer from "./Transfer";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { TransferItemInterface } from "@/interfaces/index";
import Upload from "./Upload";
import { useTranslation } from "next-i18next";

const useStyles = makeStyles((theme) =>
  createStyles({
    list: {
      padding: 0,
    },
    listItem: {
      paddingLeft: 7,
      paddingRight: 7,
      paddingBottom: 0,
      paddingTop: 7,
      margin: 0,
    },
    dialogContent: {
      padding: 0,
      margin: 0,
      backgroundColor: "#F9F9F9",
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      "& > h6": {
        color: "white",
        fontWeight: "bold",
      },
    },
    containerNoFiles: {
      padding: theme.spacing(2),
    },
  }),
);

const Transition = React.forwardRef(
  (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

export default function Transfers() {
  const classes = useStyles();
  const transferRdx = useSelector((state: { transfer: PropsTransferSelector }) => state.transfer);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");

  const handleClose = () => {
    dispatch(setOpenTransferModal(false));
  };

  const files = transferRdx.files.filter((item) => item.userId === userRdx.user.id);

  return (
    <>
      <Upload files={files} />
      <Modal
        title={c("transfer.title")}
        fullScreen
        open={transferRdx.openTransferModal}
        handleClose={handleClose}
        TransitionComponent={Transition}
        dialogContentStyle={classes.dialogContent}
        dialogTitleStyle={classes.dialogTitle}
      >
        {files.length === 0 ? (
          <Box className={classes.containerNoFiles}>
            <Text variant={TextVariantEnum.BODY2}>{c("transfer.noResults")}</Text>
          </Box>
        ) : (
          <List className={classes.list}>
            {files.reverse().map((item: TransferItemInterface) => (
              <ListItem key={uuid()} disableGutters className={classes.listItem}>
                <Transfer {...item} />
              </ListItem>
            ))}
          </List>
        )}
      </Modal>
    </>
  );
}
