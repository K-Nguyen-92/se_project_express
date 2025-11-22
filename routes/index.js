const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const { createUser, login, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateSignUpModal,
  validateLoginModal,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", validateSignUpModal, createUser);
router.post("/signin", validateLoginModal, login);
router.patch("/users/me", auth, updateProfile);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
