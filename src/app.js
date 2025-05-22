const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
var validator = require("validator");
const app = express();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")


require("dotenv").config();
const secretKey = process.env.SECRET_KEY;



app.use(express.json()); // converts response from json to js object so we can access it.
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
      res.send("User Login Successful.");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/profile", userAuth ,async (req, res) => {

  try {
    const user = req.user;
    res.send(user);  
  }
  catch (err) {
    res.send("Something went wrong!‽");
  }
});

app.post("/sendConnectionRequest",userAuth, async (req,res)=>{

console.log("Sending a connection request")
res.send("Connection Request Sent")

})





connectDB()
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("db conectivity failed");
  });
