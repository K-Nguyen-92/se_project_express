const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { NOT_FOUND, UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(NOT_FOUND).send({ message: "Authorization required" });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
