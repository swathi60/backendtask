const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_TOKEN_SECRET_KEY = "mnbvcxsDfopiyrhJsffdfhk";

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // checks for existing user
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({
        message: "User already exists with this email",
        status: "-1",
        code: "auth.register.exists.email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user if user doesn't exists
    const result = await UserModel.create({
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    // generate token for email verification only
    const token = jwt.sign(
      {
        email: result.email,
      },
      JWT_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).send({
      message: " User registered successfully",
      code: "auth.register.success",
      status: "1",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const userController = async (req, res) => {
  res.status(200).json({
    message: "success",
    data: req.user,
  });
};

const UserSignin = async (req, res) => {
  const {
    email,
    password, // password was hashed at client
  } = req.body;
  try {
    // checks for existing user
    const userFetch = await UserModel.findOne({ email: email.toLowerCase() });

    // checks whether user exists or not
    if (!userFetch) {
      return res.status(404).send({
        message: "User doesn't exists with this email",
        code: "auth.email.invalid",
        status: "-1",
      });
    }

    const matchPassword = await bcrypt.compare(password, userFetch.password);
    // checks whether user entered password is valid or not
    if (!matchPassword) {
      return res.status(409).send({
        message: "Invalid password",
        code: "auth.password.invalid",
        status: "0",
      });
    }

    // generate token for log in
    const token = jwt.sign(
      {
        id: userFetch._id,
        email: userFetch.email,
        name: userFetch.username,
      },
      JWT_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // user data
    const user = {
      name: userFetch.username,
      email: userFetch.email,
    };

    return res.status(200).json({
      message: "User signed in successfully",
      code: "auth.success",
      status: "1",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signup,
  userController,
  UserSignin,
};
