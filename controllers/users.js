const User = require("../models/user");
const { handleError } = require("../utils/handleErrors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      console.log("getUsers controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.log(`There is an error in createUser`, error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.log("getUser controller has", error.name);
      const { status, message } = handleError(error);
      res.status(status).send({ message });
    });
};

module.exports = { getUsers, createUser, getUser };
