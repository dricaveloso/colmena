import React, { useMemo, useState, useCallback } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector, PropsLibrarySelector } from "@/types/index";
import { useRouter } from "next/router";

import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import { downloadFile, getExtensionFilename, trailingSlash } from "@/utils/utils";
import { DefaultAudioTypeEnum } from "@/enums/*";
import ActionConfirm from "@/components/ui/ActionConfirm";
import Button from "@/components/ui/Button";
import { editLibraryFile } from "@/store/actions/library";
import {
  handleFileName,
  convertUsernameToPrivate,
  getRootPath,
  getFilename,
} from "@/utils/directory";
import { deleteFile, moveFile } from "@/services/webdav/files";
import { Formik, Form, Field, FieldProps } from "formik";
import { updateFile, removeByNextCloudId } from "@/store/idb/models/files";
import Divider from "@/components/ui/Divider";
import TextField from "@material-ui/core/TextField";
import Modal from "@/components/ui/Modal";
import { Grid } from "@material-ui/core";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  data: any | undefined;
  blob: Blob | null;
  filename: string;
};

const ContextMenuOptions = ({ blob, data, filename }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("file");
  const { t: l } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);

  const router = useRouter();
  const [openModalRenameTitle, setOpenModalRenameTitle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [finalPath, setFinalPath] = useState(filename);
  const path = library.currentPath;

  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });
  const [openDeleteItemConfirm, setOpenDeleteItemConfirm] = useState(false);
  const dispatch = useDispatch();

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  const extension = useMemo(() => getExtensionFilename(filename), [filename]);

  const initialValues = {
    customtitle: getFilename(filename).replace(`.${extension}`, ""),
  };

  const treatName = (name: string) => handleFileName(name);

  const handleSubmit = async (values: any) => {
    handleCloseContextMenu();
    setLoading(true);
    try {
      await moveFile(userRdx.user.id, filename, finalPath);

      dispatch(
        editLibraryFile(data.id, {
          customtitle: values.customtitle,
          basename: `${values.customtitle}.${extension}`,
          filename: finalPath,
        }),
      );
      updateFile(data.id, {
        basename: `${values.customtitle}.${extension}`,
        filename: finalPath,
        customtitle: values.customtitle,
        aliasFilename: `${values.customtitle}.${extension}`,
      });
    } catch (error) {
      console.log(error);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setLoading(false);
      setOpenModalRenameTitle(false);
      toast(l("messages.fileSuccessfullyRenamed"), "success");

      router.back();
    }
  };

  const definePath = useCallback((path) => {
    const rootPath = getRootPath();
    return !path || path === "/" ? rootPath : path;
  }, []);

  const defineFinalPath = (name: any) => {
    let aliasPath = `${trailingSlash(definePath(path))}${treatName(name)}`;
    if (extension) {
      aliasPath += `.${extension}`;
    }

    setFinalPath(convertUsernameToPrivate(aliasPath, userRdx.user.id));
  };
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenRenameModal = () => {
    handleCloseContextMenu();
    setOpenModalRenameTitle(!openModalRenameTitle);
  };

  const handleOpenDeleteItemConfirm = async () => {
    handleCloseContextMenu();
    setLoading(true);
    try {
      await deleteFile(userRdx.user.id, filename);
      await removeByNextCloudId(data.nextcloudId, userRdx.user.id);
    } catch (error) {
      console.log(error);
      toast(error.message, "error");
    } finally {
      setLoading(false);
      toast(l("messages.fileDeletedSuccessfully"), "success");

      router.back();
    }
    setOpenDeleteItemConfirm(!openDeleteItemConfirm);
  };

  const handleOpenCloseModal = () => {
    setOpenDeleteItemConfirm(!openDeleteItemConfirm);
  };

  return (
    <>
      <Modal
        title={t("contextMenuOptions.renameTitle")}
        handleClose={() => setOpenModalRenameTitle(false)}
        open={openModalRenameTitle}
      >
        <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
          {({ setFieldValue }: any) => (
            <Form>
              <Field name="customtitle" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="customtitle"
                    label={c("form.fields.name")}
                    variant="outlined"
                    style={{
                      width: "100%",
                    }}
                    inputProps={{ maxLength: 60 }}
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("customtitle", treatName(event.target.value))
                    }
                    onKeyUp={(event: any) => defineFinalPath(event.target.value)}
                  />
                )}
              </Field>
              <Divider marginTop={20} />
              <Grid container justifyContent="flex-end">
                <Button
                  title={c("form.submitSaveTitle")}
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Modal>
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          key={uuid()}
          icon="more_vertical"
          iconColor="#656469"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
          handleClick={handleOpenContextMenu}
        />
        <Menu
          key={uuid()}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          anchorReference="anchorPosition"
          anchorPosition={
            position.mouseY !== null && position.mouseX !== null
              ? { top: position.mouseY, left: position.mouseX }
              : undefined
          }
          onClose={handleCloseContextMenu}
        >
          <MenuItem
            key="download"
            onClick={() =>
              downloadFile(blob, `${data.title}.${DefaultAudioTypeEnum.type}`, data.getcontenttype)
            }
          >
            {t("contextMenuOptions.downloadTitle")}
          </MenuItem>
          <MenuItem key="rename" onClick={() => handleOpenRenameModal()}>
            {t("contextMenuOptions.renameTitle")}
          </MenuItem>
          <MenuItem key="edit" onClick={() => toast(c("featureUnavailable"), "warning")}>
            {t("contextMenuOptions.editAudio")}
          </MenuItem>
          <MenuItem key="remove" onClick={() => handleOpenCloseModal()} style={{ color: "tomato" }}>
            {t("contextMenuOptions.deleteAudio")}
          </MenuItem>
        </Menu>
        {openDeleteItemConfirm && (
          <ActionConfirm
            onOk={handleOpenDeleteItemConfirm}
            onClose={handleOpenCloseModal}
            isLoading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default ContextMenuOptions;
