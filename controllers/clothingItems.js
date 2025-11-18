const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/errors");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../errors/customErrors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      console.log("createItem controller has", error.name);
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      console.log("getItems controller has", error.name);
      next(error);
    });
};

const deleteItem = (req, res) => {
  clothingItems
    .findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      }
      if (!item.owner.equals(req.user._id)) {
        next(new ForbiddenError("Unauthorized Delete"));
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
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
      }
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
        next(new BadRequestError("Invalid data provided"));
      }
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(error);
      }
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
        next(new BadRequestError("Invalid data provided"));
      }
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
