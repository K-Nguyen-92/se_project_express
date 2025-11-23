const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, auth, updateProfile);

module.exports = router;
