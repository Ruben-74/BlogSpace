import React from "react";

import { FaSpaceShuttle } from "react-icons/fa";

function Contact() {
  async function submitHandler(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:9000/api/v1/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.status === 201) {
      navigate("/auth/login");
    } else {
      const data = await response.json();
      dispatch(setMsg(data.msg));
    }
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} style={{ transform: "rotate(-90deg)" }} />
      <hr />
      <h1>Contact Us ?</h1>

      {/* Div pour regrouper le paragraphe et le lien */}
      <div className="info-line">
        <p>Have you a problem ?</p>
      </div>
      <form onSubmit={submitHandler}>
        <label htmlFor="etxt"> Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          autoComplete="username"
          tabIndex="1"
        />

        <label htmlFor="email"> Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
          tabIndex="2"
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          required
          autoComplete="content"
          tabIndex="3"
          rows="5" // Adjust the number of rows as needed
          style={{ resize: "vertical" }} // Allows vertical resizing
        />

        <button type="submit">Envoyer</button>
      </form>
    </section>
  );
}

export default Contact;
