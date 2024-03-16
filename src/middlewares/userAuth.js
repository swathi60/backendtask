const UserModel = require("../models/User");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const JWT_TOKEN_SECRET_KEY = "mnbvcxsDfopiyrhJsffdfhk";

const protect = async (req, res, next) => {
  // get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(404).send({
      message: "Invalid Login",
      status: "-1",
    });
  }
  // validate token
  const decoded = await promisify(jwt.verify)(token, JWT_TOKEN_SECRET_KEY);
  // check user exists
  const currentUser = await UserModel.findById(decoded.id, { password: 0 });
  if (!currentUser) {
    return res.status(404).send({
      message: "User doesnt exists",
      status: "-1",
    });
  }
  req.user = currentUser;
  next();
};

module.exports = {
  protect,
};
