export default (req, res, next) => {
  console.log("im middleware", req.session);
  console.log("im middleware", req.session.user);

  if (req.session) {
    if (req.session.user.role === "user") {
      next();
    }
  } else {
    res.status(401).json({
      msg: "Not authorize",
    });
  }
};
