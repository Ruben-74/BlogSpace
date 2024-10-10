import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSpaceShuttle, FaTimes } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slicesRedux/user";
import { toggleMenu } from "../../store/slicesRedux/menu";

function Header() {
  const user = useSelector((state) => state.user);
  const menu = useSelector((state) => state.menu);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  function onClickLogout() {
    async function fetchLogout() {
      const response = await fetch("http://localhost:9000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.status === 200) {
        const data = await response.json();
        dispatch(logout(data.isLogged));
        dispatch(toggleMenu());
        navigate("/");
      }
    }
    fetchLogout();
  }

  return (
    <header>
      {type === "mobile" && (
        <div className="logo-title">
          <FaSpaceShuttle size={50} />
          BlogSpace
        </div>
      )}
      <div className="header-content">
        <button
          className="menu-toggle"
          onClick={() => dispatch(toggleMenu())}
          aria-label="Toggle menu"
        >
          <div className="menu-icon">
            {type === "mobile" && menu.isOpen ? (
              <FaTimes size={20} />
            ) : (
              <img src={`/icons/${user.avatar}`} alt="menu" />
            )}
          </div>
        </button>

        <nav
          className={`nav ${
            type === "mobile" && menu.isOpen ? "burger" : "screen"
          }`}
        >
          <div className={type === "mobile" ? "logo-column" : "logo-title"}>
            <FaSpaceShuttle size={50} />
            BlogSpace
          </div>

          <div className="links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHouse
                size={24}
                className={({ isActive }) => (isActive ? "active-icon" : "")}
              />
            </NavLink>
            <NavLink
              to="/automobile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Automobile
            </NavLink>
            <NavLink
              to="/aviation"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Aviation
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contactez-nous
            </NavLink>
          </div>

          <div className="auth-container">
            {user.isLogged ? (
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
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/auth/login" className="login-link">
                  S'identifier
                </NavLink>
                <NavLink to="/auth/register" className="register-link">
                  Démarrer
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
