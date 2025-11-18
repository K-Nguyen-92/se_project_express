const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
const corsOptions = {
  origin: "https://gcp-wtwr.ignorelist.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   req.user = {
//     _id: "68d04a07733f93c6cd4b16ad",
//   };
//   next();
// });
app.use("/", mainRouter);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
