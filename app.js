const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "68d04a07733f93c6cd4b16ad",
  };
  next();
});
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
