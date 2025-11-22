const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
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
      if (error.code === 11000) {
        next(new ConflictError("User with this email already exists"));
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (req, res, next) => {
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
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      }
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((error) => {
      if (error.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(error);
      }
    });
};

const updateProfile = (req, res, next) => {
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
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      }
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(error);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
