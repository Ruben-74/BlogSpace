import { createContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

const INITIAL_STATE = {
  username: "",
  isLogged: false,
};

function Provider({ children }) {
  const [user, setUser] = useState(INITIAL_STATE);

  //state.login
  function login(username) {
    setUser({ username, isLogged: true });
  }

  //state.logout
  function logout() {
    setUser(INITIAL_STATE);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

//declare provider
Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext };

export default Provider;
