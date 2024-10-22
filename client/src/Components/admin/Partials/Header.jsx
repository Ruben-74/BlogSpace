import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaPowerOff, FaSpaceShuttle, FaTimes, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slicesRedux/user";
import { toggleMenu } from "../../../store/slicesRedux/menu";
import { FaHouse } from "react-icons/fa6";

function Header() {
  const user = useSelector((state) => state.user);
  console.log(user);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utiliser le hook useNavigate

  const [type, setType] = useState(
    window.innerWidth > 600 ? "tabletAndMore" : "mobile"
  );

  useEffect(() => {
    const handleResize = () => {
      setType(window.innerWidth > 600 ? "tabletAndMore" : "mobile");
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function onClickLogout() {
    try {
      const response = await fetch("http://localhost:9000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(logout());
        dispatch(toggleMenu());
        navigate("/"); // Utiliser navigate pour la redirection
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const shuttleStyle = {
    transform: type === "mobile" ? "rotate(-90deg)" : "none",
    transition: "transform 0.3s ease",
  };

  return (
    <header>
      {type === "mobile" && (
        <div className="logo-title">
          <FaSpaceShuttle size={50} />
          BlogSpace
        </div>
      )}
      <div className="header-content">
        {type === "mobile" && menu.isOpen ? (
          <button
            className="menu-toggle"
            onClick={() => dispatch(toggleMenu())}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              <FaTimes size={20} />
            </div>
          </button>
        ) : (
          <button
            className="menu-toggle"
            onClick={() => dispatch(toggleMenu())}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              <img src={`/icons/${user.avatar}`} alt="menu" />
            </div>
          </button>
        )}
        <nav
          className={`nav ${
            type === "mobile" && menu.isOpen ? "burger" : "screen"
          }`}
        >
          <div className={type === "mobile" ? "logo-column" : "logo-title"}>
            <FaSpaceShuttle size={50} style={shuttleStyle} />
            BlogSpace
          </div>

          <div className="links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHouse size={24} />
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Articles
            </NavLink>
            <NavLink
              to="/comment"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Commentaires
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Catégories
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Utilisateurs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Messagerie
            </NavLink>
          </div>

          <div className="auth-container">
            {user.isLogged && type === "mobile" ? (
              <>
                <NavLink className="user-info">
                  <img
                    src={`/icons/${user.avatar}`}
                    alt="User Avatar"
                    className="avatar"
                  />
                </NavLink>

                <button
                  className="logout-button"
                  onClick={onClickLogout}
                  aria-label="Logout"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className="user-info">
                  <img
                    src={`/icons/${user.avatar}`}
                    alt="User Avatar"
                    className="avatar"
                  />
                </NavLink>

                <button
                  className="logout-button"
                  onClick={onClickLogout}
                  aria-label="Logout"
                >
                  <FaPowerOff />
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
