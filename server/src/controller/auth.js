import Auth from "../model/Auth.js";
import bcrypt from "bcrypt";

const SALT = 10;

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [[user]] = await Auth.findOneByEmail(email);

    // Check if user already exists
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, SALT);
    const [response] = await Auth.create({ username, email, password: hash });

    // Check if the user was created successfully
    if (response.affectedRows === 1) {
      return res.status(201).json({ msg: "User created" });
    } else {
      return res.status(500).json({ msg: "User not created" });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await Auth.findOneByEmail(email);

    if (!user) {
      res.status(400).json({ msg: "User not found" });
    }
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const [[userByID]] = await Auth.findUserInfoById(user.id);
        console.log("dddd", userByID);
        req.session.user = { id: user.id, ...userByID };
        res
          .status(200)
          .json({ msg: "User logged in", isLogged: true, user: userByID });
      } else {
        res.status(400).json({ msg: "Invalid credentials" });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const logout = async (req, res) => {
  try {
    // destruction de la session en BDD (store sql)
    req.session.destroy();
    // suppression du cookie de session
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "User logged out", isLogged: false });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const check_auth = async (req, res) => {
  const { user } = req.session;

  if (user) {
    console.log("check-auth", user);
    // si user existe
    res.json({ isLogged: true, user });
  } else {
    res.status(401).json({ isLogged: false });
  }
};

export { register, login, logout, check_auth };
