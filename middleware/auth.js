const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    jwt.verify(token, "secret", (err, user) => {
      if (err)
        return res.status(401).json({
          status: 401,
          message: "Unauthorized User",
        });
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  } catch (e) {
    res.status(500).send({ message: "Invalid Token" });
  }
};
