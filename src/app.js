const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
var cors = require('cors')

app.use(cors({
  origin:"http://localhost:5173",
  credentials : true
}))
app.use(express.json()); // converts response from json to js object so we can access it.
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter)
app.use("/",userRouter)


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
