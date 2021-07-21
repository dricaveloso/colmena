import React, { createContext, useState } from "react";
import { UserInfoInterface } from "@/interfaces/index";

interface UserContextInterface {
  isLogged: boolean;
  userInfo: UserInfoInterface | null;
  invitationToken: string;
  changeIsLogged: (flag: boolean) => void;
  updateUserInfo: (data: UserInfoInterface) => void;
  updateInvitationToken: (data: string) => void;
}

const UserContext = createContext<UserContextInterface>({
  isLogged: false,
  userInfo: null,
  invitationToken: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeIsLogged: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateUserInfo: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateInvitationToken: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoInterface | null>({
    id: 1,
    name: "Makena",
    email: "makena@colmena.media",
    role: "admin",
    media: {
      id: 1,
      name: "Radio XYZ",
    },
  });
  const [invitationToken, setInvitationToken] = useState("");

  function changeIsLoggedHandler(flag: boolean) {
    setIsLogged(flag);
  }

  function updateUserInfoHandler(data: UserInfoInterface) {
    setUserInfo(data);
  }

  function updateInvitationTokenHandler(data: string) {
    setInvitationToken(data);
  }

  const context: UserContextInterface = {
    isLogged,
    userInfo,
    invitationToken,
    changeIsLogged: changeIsLoggedHandler,
    updateUserInfo: updateUserInfoHandler,
    updateInvitationToken: updateInvitationTokenHandler,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

export default UserContext;
