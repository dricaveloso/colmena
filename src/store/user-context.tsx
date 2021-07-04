import React, { createContext, useState } from "react";
import { UserInfoInterface } from "interfaces";

interface UserContextInterface {
  isLogged: boolean;
  userInfo: UserInfoInterface | null;
  changeIsLogged: (flag: boolean) => void;
  updateUserInfo: (data: UserInfoInterface) => void;
}

const UserContext = createContext<UserContextInterface>({
  isLogged: false,
  userInfo: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeIsLogged: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateUserInfo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null);

  function changeIsLoggedHandler(flag: boolean) {
    setIsLogged(flag);
  }

  function updateUserInfoHanlder(data: UserInfoInterface) {
    setUserInfo(data);
  }

  const context: UserContextInterface = {
    isLogged,
    userInfo,
    changeIsLogged: changeIsLoggedHandler,
    updateUserInfo: updateUserInfoHanlder,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

export default UserContext;
