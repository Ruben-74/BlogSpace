import React, { useState, useContext } from "react";
import Form from "../Partials/Form";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../store/user/Context.jsx";
import { FaSpaceShuttle } from "react-icons/fa";

function Login() {
  const state = useContext(UserContext);

  const [user, setUser] = useState({ username: "joey", password: "aze" });
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    if (!user.username || !user.password) {
      setMsg("Please fill in all fields");
      return;
    }
    state.login(user.username);
    navigate("/");
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} style={{ transform: "rotate(-90deg)" }} />
      <hr />
      <h1>Welcome back to BlogSpace</h1>

      {/* Div pour regrouper le paragraphe et le lien */}
      <div className="info-line">
        <p>New in this platform?</p>
        <Link to={"/register"}>Sign up</Link>
      </div>
      <Form
        submitHandler={submitHandler}
        user={user}
        setUser={setUser}
        msg={msg}
      >
        <button type="submit">Login</button>
      </Form>
    </section>
  );
}

export default Login;
