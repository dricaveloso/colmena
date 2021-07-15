import React, { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerBottomRecording";

type Props = {
  page: string;
};

function AppTab({ page }: Props) {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setOpenSearch(false);
  };

  const handleOpen = () => {
    setOpenSearch(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      {page !== "/home" && (
        <Box>
          <IconButton
            icon="back"
            handleClick={() => {
              router.back();
            }}
          />
        </Box>
      )}
      <Box>
        <IconButton
          icon="home"
          url="/home"
          color={page === "/home" ? theme.palette.primary.main : "black"}
        />
      </Box>
      <Box>
        <IconButton
          icon="microphone"
          handleClick={handleOpenDrawer}
          color={page === "/call" ? theme.palette.primary.main : "black"}
        />
      </Box>
      <Box>
        <IconButton
          icon="search"
          color={page === "/search" ? theme.palette.primary.main : "black"}
          handleClick={handleOpen}
        />
      </Box>
      <Box>
        <IconButton
          icon="library"
          url="/library"
          color={page === "/library" ? theme.palette.primary.main : "black"}
        />
      </Box>
      <FullScreenSearch open={openSearch} handleClose={handleClose} />
      <DrawerBottomRecording
        open={openDrawer}
        handleOpen={handleOpenDrawer}
        handleClose={handleCloseDrawer}
      />
    </>
  );
}

export default AppTab;
