import React, { createContext, useState } from "react";

interface UserContextInterface {
  isLogged: boolean;
  userInfo: {} | null;
  changeIsLogged: (flag: boolean) => void;
  updateUserInfo: (data: {}) => void;
}

const UserContext = createContext<UserContextInterface>({
  isLogged: false,
  userInfo: null,
  changeIsLogged: (flag: boolean) => {},
  updateUserInfo: (data: {}) => {},
});

type Props = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  function changeIsLoggedHandler(flag: boolean) {
    setIsLogged(flag);
  }

  function updateUserInfoHanlder(data: {}) {
    setUserInfo(data);
  }

  const context: UserContextInterface = {
    isLogged,
    userInfo,
    changeIsLogged: changeIsLoggedHandler,
    updateUserInfo: updateUserInfoHanlder,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}

export default UserContext;
