import PropTypes from "prop-types";

function Form(props) {
  return (
    <>
      {props.msg && <p>{props.msg}</p>}

      <form onSubmit={props.submitHandler}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={props.user.username}
          onChange={(e) =>
            props.setUser({
              ...props.user,
              username: e.target.value,
            })
          }
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={props.user.password}
          onChange={(e) =>
            props.setUser({
              ...props.user,
              password: e.target.value,
            })
          }
          required
        />

        {props.children}
      </form>
    </>
  );
}

Form.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  children: PropTypes.node,
  msg: PropTypes.string,
};

export default Form;
