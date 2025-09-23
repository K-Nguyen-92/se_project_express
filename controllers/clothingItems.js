const clothingItems = require("../models/clothingItem");
const { handleError } = require("../utils/handelErrors");

const createItem = (req, res) => {
  const { name, link, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, link, weather, imageUrl })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      console.log("createItem controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      console.log("getItems controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  clothingItems
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      console.log("updateItem controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

const deleteItem = (req, res) => {
  clothingItems
    .findByIdAndDelete(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      console.log("deleteItem controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

likeItem = (req, res) => {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      console.log("likeItem controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

dislikeItem = (req, res) => {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      console.log("dislikeItem controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
