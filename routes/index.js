const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  getUsers,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/users/me", auth, getCurrentUser);
router.get("/users", getUsers);
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.patch("/users/me", auth, updateProfile);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
