export default (req, res, next) => {
  console.log(req.session);
  console.log("ADMIN MIDDLEWARE", req.session.user);

  if (req.session.user) {
    if (req.session.user.role === "admin") {
      next();
    }
  } else {
    res.status(401).json({ msg: "Unauthorized" });
  }
  // if(req.session.user || req.session.user.role !== "admin") res.status(401).json({ msg: "Unauthorized" });
};
