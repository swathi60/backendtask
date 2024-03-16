const express = require("express");
const {
  signup,
  userController,
  UserSignin,
} = require("./src/controllers/userController");
const { UserAuth, protect } = require("./src/middlewares/userAuth");

const app = express();

app.use(express.json());

app.post("/user/signup", signup);

app.post("/user/login", UserSignin);

app.get("/user/details", protect, userController);

// Handle wrong routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
  });
});

module.exports = app;
