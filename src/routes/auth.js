// ## 🔐 Auth Routes (`authRouter`)
// | Method | Endpoint        | Description     |
// |--------|------------------|-----------------|
// | POST   | `/signUp`        | Register a new user |
// | POST   | `/login`         | Authenticate a user |
// | POST   | `/logout`        | Log out the current user |


const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
var validator = require("validator");



authRouter.post("/signup", async (req, res) => {
  //VALIDATION OF DATA
  validateSignUpData(req); //never trust req.body
  //ENCRYPT THE PASSWORD

  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    const isEmailValid = validator.isEmail(req.body.emailId); //=> true
    console.log(isEmailValid);

    if (isEmailValid) {
      await user.save();
      res.send("data added successfully.");
    } else {
      res.send("enter valid email.");
    }
  } catch (err) {
    res.send(err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    // console.log(user);
    if (user === null) {
      throw new Error("invalid credentials!");
    }

    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      // create a jwt token
      const token = await user.getJWT();

      // add token to cookie and send the response back to the user/client
      res.cookie("token", token,{httpOnly : true ,expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
      // res.send("User Login Successful.");
      res.send(user);
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/logout", (req,res)=>{
    // cleanup activities.. if have some sessions etc..


    res.cookie("token",null,{
        expires: new Date(Date.now())
    }).send("User logged out successfully."); 
})
 
module.exports = authRouter
