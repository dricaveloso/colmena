import { createContext, useState } from "react";

const UserContext = createContext({
  isLogged: false,
  userInfo: null,
  changeIsLogged: () => {},
  updateUserInfo: () => {},
});

export function UserContextProvider(props) {
  const [isLogged, setIsLogged] = useState();
  const [userInfo, setUserInfo] = useState();

  function changeIsLoggedHandler(flag) {
    setIsLogged(flag);
  }

  function updateUserInfoHanlder(data) {
    setUserInfo(data);
  }

  const context = {
    isLogged,
    userInfo,
    changeIsLogged: changeIsLoggedHandler,
    updateUserInfo: updateUserInfoHanlder,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
