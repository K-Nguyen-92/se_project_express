const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
} = require("../controllers/users");
const bcrypt = require("bcryptjs");

router.get("/", getUsers);
// router.get("/:userId", getCurrentUser);
// router.post("/", createUser);
// router.post("/signup", createUser);

module.exports = router;
