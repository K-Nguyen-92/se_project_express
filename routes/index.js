const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const { createUser, login } = require("../controllers/users");
const {
  validateSignUpModal,
  validateLoginModal,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", validateSignUpModal, createUser);
router.post("/signin", validateLoginModal, login);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
