// const { handleError } = require("../utils/handleErrors");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      console.log("getUsers controller has", error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.log(`There is an error in createUser`, error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      } 
        return res.status(DEFAULT).send({ message: "Internal Server Error" });
      
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.log("getUser controller has", error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      } if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Resource not found" });
      } 
        return res.status(DEFAULT).send({ message: "Internal Server Error" });
      
    });
};

module.exports = { getUsers, createUser, getUser };
