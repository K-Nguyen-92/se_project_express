const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCardModal,
  validateClothesId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateCardModal, auth, createItem);
router.delete("/:itemId", validateClothesId, auth, deleteItem);
router.put("/:itemId/likes", validateClothesId, auth, likeItem);
router.delete("/:itemId/likes", validateClothesId, auth, dislikeItem);

module.exports = router;
