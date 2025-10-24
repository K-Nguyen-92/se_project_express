const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      console.log("createItem controller has", error.name);
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      console.log("getItems controller has", error.name);
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const deleteItem = (req, res) => {
  clothingItems
    .findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (!item.owner.equals(req.user._id)) {
        return res.status(FORBIDDEN).send({ message: "Unauthorized Delete" });
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((error) => {
      console.log("deleteItem controller has", error.name);
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const likeItem = (req, res) => {
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
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Resource not found" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const dislikeItem = (req, res) => {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      console.log("dislikeItem controller has", error.name);
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Resource not found" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
