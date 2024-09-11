import React, { useState, useContext } from "react";
import Form from "../Partials/Form";
import { Link, useNavigate } from "react-router-dom";
import { FaSpaceShuttle } from "react-icons/fa";

function Register() {
  const [user, setUser] = useState({ username: "", password: "" });

  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    if (!user.username || !user.password) {
      setMsg("Please fill in all fields");
      return;
    }
    navigate("/login");
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} style={{ transform: "rotate(-90deg)" }} />
      <hr />
      <h1>Try BlogSpace for Free</h1>

      {/* Div pour regrouper le paragraphe et le lien */}
      <div className="info-line">
        <p>Have an account already?</p>
        <Link to={"/register"}>Sign In</Link>
      </div>
      <Form
        submitHandler={submitHandler}
        user={user}
        setUser={setUser}
        msg={msg}
      >
        <button type="submit">Register</button>
      </Form>
    </section>
  );
}

export default Register;
