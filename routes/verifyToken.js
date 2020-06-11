var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("timer");
  if (!token) {
    return res.status(401).send({
      status: "error",
      error: "Access Denied",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ status: 400, message: "token expired" });
  }
};
