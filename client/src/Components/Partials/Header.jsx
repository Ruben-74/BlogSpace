import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSpaceShuttle } from "react-icons/fa";
function Header() {
  return (
    <header>
      <Link className="logo-title">
        <FaSpaceShuttle size={50} />
        BlogSpace
      </Link>
      <nav>
        <NavLink to={"/"}>HomePage</NavLink>
        <NavLink to={"/"}>Multimedia</NavLink>
        <NavLink to={"/"}>Football</NavLink>
      </nav>

      <div className="auth-container">
        <NavLink to={"/auth/login"}>S'identifier</NavLink>
        <NavLink to={"/auth/register"}> Démarrer</NavLink>
      </div>

      {/* <button onClick={() => state.logout()}>
          <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" /> Logout
        </button> */}

      {/* <div className="avatar-container">
          <img
            src={state.user.avatarUrl || "./images/default-avatar.jpg"}
            alt="Avatar"
            className="avatar"
          />
          <span className="user-name">{state.user.username}</span>
        </div> */}
    </header>
  );
}

export default Header;
