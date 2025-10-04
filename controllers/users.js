// const { handleError } = require("../utils/handleErrors");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT, EXIST } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email: req.body.email, password: hash })
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    )
    .catch((error) => {
      console.log("createUser controller has", error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
      if (error.code === 11000) {
        return res.status(409).send({
          message: "A user with this email already exists.",
        });
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating an item" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) =>
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    )
    .catch((error) => {
      console.log("getCurrentUser controller has", error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) =>
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    )
    .catch((error) => {
      console.log("updateProfile controller has", error.name);
      // const { status, message } = handleError(error);
      // res.status(status).send({ message });
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

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
