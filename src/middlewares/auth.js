const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const userAuth = async (req, res, next) => {
  // read the token from the request cookies
  // validate the token
  // find the user

  try {
    const cookies = req.cookies; // get cookies
    const { token } = cookies; // extract token from cookies

    if(!token){
      return res.status(401).send("Please login.")
    }

    const decodedObj = await jwt.verify(token, secretKey);

    const { _id } = decodedObj;
    const user = await User.findById({ _id });
    
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // saving user obj to req so not need to find again in api
    next();
  } catch (err) {
    res.status(400).send("Error: "+ err.message)
  }
};

module.exports = {
  userAuth,
};
